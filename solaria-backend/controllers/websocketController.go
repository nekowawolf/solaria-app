package controllers

import (
    "log"
    "solaria-backend/config"
    "solaria-backend/models"
    
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/websocket/v2"
)

// WebSocket handler for admin dashboard
func WebSocketAdmin(c *fiber.Ctx) error {
    if websocket.IsWebSocketUpgrade(c) {
        return c.Next()
    }
    return fiber.ErrUpgradeRequired
}

func WebSocketAdminHandler(conn *websocket.Conn) {
    defer conn.Close()
    
    // Create channel for this connection
    ch := make(chan []byte, 10)
    clientID := conn.Params("id")
    if clientID == "" {
        clientID = conn.RemoteAddr().String()
    }
    
    // Register channel
    RegisterOrderChannel(clientID, ch)
    defer UnregisterOrderChannel(clientID)
    
    // Send initial data (pending orders)
    go func() {
        rows, err := config.DB.Query(`
            SELECT id, order_code, total_amount, status, payment_status, created_at
            FROM orders WHERE status IN ('pending', 'confirmed') 
            ORDER BY created_at DESC
        `)
        if err == nil {
            defer rows.Close()
            var orders []map[string]interface{}
            for rows.Next() {
                var id int
                var orderCode string
                var totalAmount float64
                var status, paymentStatus string
                var createdAt string
                
                rows.Scan(&id, &orderCode, &totalAmount, &status, &paymentStatus, &createdAt)
                orders = append(orders, map[string]interface{}{
                    "order_code": orderCode,
                    "total_amount": totalAmount,
                    "status": status,
                    "payment_status": paymentStatus,
                    "created_at": createdAt,
                })
            }
            
            if len(orders) > 0 {
                
            }
        }
    }()
    
    // Keep connection alive and listen for broadcasts
    for {
        select {
        case msg := <-ch:
            if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
                log.Printf("WebSocket write error: %v", err)
                return
            }
        }
    }
}

// WebSocket handler for cashier (scan order)
func WebSocketCashier(c *fiber.Ctx) error {
    if websocket.IsWebSocketUpgrade(c) {
        return c.Next()
    }
    return fiber.ErrUpgradeRequired
}

func WebSocketCashierHandler(conn *websocket.Conn) {
    defer conn.Close()
    
    for {
        // Read message from cashier (scanned code)
        _, msg, err := conn.ReadMessage()
        if err != nil {
            log.Printf("WebSocket read error: %v", err)
            break
        }
        
        // Process scanned order code
        orderCode := string(msg)
        log.Printf("Cashier scanned: %s", orderCode)
        
        // Fetch order details
        var order models.OrderResponse
        var orderModel models.Order
        
        err = config.DB.QueryRow(`
            SELECT id, order_code, total_amount, status, payment_status, created_at, updated_at
            FROM orders WHERE order_code = $1
        `, orderCode).Scan(&orderModel.ID, &orderModel.OrderCode, &orderModel.TotalAmount,
            &orderModel.Status, &orderModel.PaymentStatus, &orderModel.CreatedAt, &orderModel.UpdatedAt)
        
        if err != nil {
            // Order not found
            conn.WriteMessage(websocket.TextMessage, []byte(`{"error": "Order not found"}`))
            continue
        }
        
        // Get order items
        rows, err := config.DB.Query(`
            SELECT id, menu_code, menu_name, quantity, price
            FROM order_items WHERE order_id = $1
        `, orderModel.ID)
        if err == nil {
            var items []models.OrderItem
            for rows.Next() {
                var item models.OrderItem
                rows.Scan(&item.ID, &item.MenuCode, &item.MenuName, &item.Quantity, &item.Price)
                items = append(items, item)
            }
            rows.Close()
            order.OrderItems = items
        }
        
        order.Order = orderModel
        
        // Send order details back to cashier
        response := map[string]interface{}{
            "type":  "order_details",
            "order": order,
        }
        
        // You can marshal and send the response here
        _ = response
        
        // Notify admin about scanned order
        broadcastScannedOrder(orderCode)
    }
}

func broadcastScannedOrder(orderCode string) {
    data := []byte(`{"type": "order_scanned", "order_code": "` + orderCode + `"}`)
    for _, ch := range orderChannels {
        select {
        case ch <- data:
        default:
        }
    }
}