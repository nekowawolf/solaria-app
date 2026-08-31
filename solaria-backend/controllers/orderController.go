package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"solaria-backend/config"
	"solaria-backend/models"
	"solaria-backend/utils"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ===== WEBSOCKET HUB =====
var orderChannels = make(map[string]chan []byte)

// ===== CREATE ORDER =====
func CreateOrder(c *fiber.Ctx) error {
	var req models.CreateOrderRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}

	if len(req.Items) == 0 {
		return utils.ErrorResponse(c, 400, "Order must have at least one item")
	}

	// Generate unique order code
	orderCode := generateOrderCode()
	var totalAmount float64 = 0
	var orderItems []models.OrderItem

	// ===== BEGIN TRANSACTION =====
	tx, err := config.DB.Begin()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Database error")
	}
	defer tx.Rollback()

	status := req.Status
	if status == "" {
		status = "pending"
	}
	paymentStatus := req.PaymentStatus
	if paymentStatus == "" {
		paymentStatus = "unpaid"
	}

	// Insert order
	var orderID int
	err = tx.QueryRow(`
        INSERT INTO orders (order_code, total_amount, status, payment_status)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, orderCode, 0, status, paymentStatus).Scan(&orderID)

	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to create order")
	}

	// ===== PROCESS EACH ITEM =====
	for _, itemReq := range req.Items {
		var menu models.Menu
		err := tx.QueryRow(`
            SELECT id, code, name, price FROM menus WHERE code = $1
        `, itemReq.MenuCode).Scan(&menu.ID, &menu.Code, &menu.Name, &menu.Price)

		if err == sql.ErrNoRows {
			return utils.ErrorResponse(c, 400, fmt.Sprintf("Menu with code %s not found", itemReq.MenuCode))
		}
		if err != nil {
			return utils.ErrorResponse(c, 500, "Database error")
		}

		itemTotal := menu.Price * float64(itemReq.Quantity)
		totalAmount += itemTotal

		// Insert order item
		var orderItem models.OrderItem
		err = tx.QueryRow(`
            INSERT INTO order_items (order_id, menu_id, menu_code, menu_name, quantity, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, order_id, menu_id, menu_code, menu_name, quantity, price, created_at
        `, orderID, menu.ID, menu.Code, menu.Name, itemReq.Quantity, menu.Price).
			Scan(&orderItem.ID, &orderItem.OrderID, &orderItem.MenuID, &orderItem.MenuCode,
				&orderItem.MenuName, &orderItem.Quantity, &orderItem.Price, &orderItem.CreatedAt)

		if err != nil {
			return utils.ErrorResponse(c, 500, "Failed to create order item")
		}
		orderItems = append(orderItems, orderItem)
	}

	// Update order total amount (including tax and rounding)
	finalTotal := calculateFinalTotal(totalAmount)
	_, err = tx.Exec("UPDATE orders SET total_amount = $1 WHERE id = $2", finalTotal, orderID)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to update order total")
	}

	// ===== COMMIT TRANSACTION =====
	if err := tx.Commit(); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to save order")
	}

	// Get complete order
	var order models.Order
	err = config.DB.QueryRow(`
        SELECT id, order_code, total_amount, status, payment_status, created_at, updated_at
        FROM orders WHERE order_code = $1
    `, orderCode).Scan(&order.ID, &order.OrderCode, &order.TotalAmount,
		&order.Status, &order.PaymentStatus, &order.CreatedAt, &order.UpdatedAt)

	response := models.OrderResponse{
		Order:      order,
		OrderItems: orderItems,
	}

	// ===== BROADCAST VIA WEBSOCKET =====
	broadcastNewOrder(response)

	return utils.SuccessResponse(c, 201, "Order created successfully", response)
}

// ===== CREATE ORDER FROM CODE STRING =====
// Format: "S1(2),S2(1)" or "S1(2), S2(1)"
// Each item MUST have quantity in parentheses: CODE(QUANTITY)
func CreateOrderFromCode(c *fiber.Ctx) error {
	var req struct {
		Code string `json:"code"`
	}

	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}

	fmt.Printf("===== CreateOrderFromCode called =====\n")
	fmt.Printf("Raw request body code: '%s'\n", req.Code)

	if req.Code == "" {
		return utils.ErrorResponse(c, 400, "Code cannot be empty")
	}

	// Parse code string
	items := parseOrderCode(req.Code)
	fmt.Printf("Parsed items count: %d\n", len(items))

	if len(items) == 0 {
		return utils.ErrorResponse(c, 400, "Invalid order code format. Use format like: S1(2),S2(1)")
	}

	// Create order request
	orderReq := models.CreateOrderRequest{
		Items: items,
	}

	// Directly call CreateOrder logic instead of reusing the handler
	return createOrderDirect(c, orderReq)
}

// New helper function to create order directly
func createOrderDirect(c *fiber.Ctx, req models.CreateOrderRequest) error {
	if len(req.Items) == 0 {
		return utils.ErrorResponse(c, 400, "Order must have at least one item")
	}

	// Generate unique order code
	orderCode := generateOrderCode()
	var totalAmount float64 = 0
	var orderItems []models.OrderItem

	// Begin transaction
	tx, err := config.DB.Begin()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Database error")
	}
	defer tx.Rollback()

	status := req.Status
	if status == "" {
		status = "pending"
	}
	paymentStatus := req.PaymentStatus
	if paymentStatus == "" {
		paymentStatus = "unpaid"
	}

	// Insert order
	var orderID int
	err = tx.QueryRow(`
        INSERT INTO orders (order_code, total_amount, status, payment_status)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, orderCode, 0, status, paymentStatus).Scan(&orderID)

	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to create order")
	}

	// Process each item
	for _, itemReq := range req.Items {
		var menu models.Menu
		err := tx.QueryRow(`
            SELECT id, code, name, price FROM menus WHERE code = $1
        `, itemReq.MenuCode).Scan(&menu.ID, &menu.Code, &menu.Name, &menu.Price)

		if err == sql.ErrNoRows {
			return utils.ErrorResponse(c, 400, fmt.Sprintf("Menu with code %s not found", itemReq.MenuCode))
		}
		if err != nil {
			return utils.ErrorResponse(c, 500, "Database error")
		}

		itemTotal := menu.Price * float64(itemReq.Quantity)
		totalAmount += itemTotal

		// Insert order item
		var orderItem models.OrderItem
		err = tx.QueryRow(`
            INSERT INTO order_items (order_id, menu_id, menu_code, menu_name, quantity, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, order_id, menu_id, menu_code, menu_name, quantity, price, created_at
        `, orderID, menu.ID, menu.Code, menu.Name, itemReq.Quantity, menu.Price).
			Scan(&orderItem.ID, &orderItem.OrderID, &orderItem.MenuID, &orderItem.MenuCode,
				&orderItem.MenuName, &orderItem.Quantity, &orderItem.Price, &orderItem.CreatedAt)

		if err != nil {
			return utils.ErrorResponse(c, 500, "Failed to create order item")
		}
		orderItems = append(orderItems, orderItem)
	}

	// Update order total amount (including tax and rounding)
	finalTotal := calculateFinalTotal(totalAmount)
	_, err = tx.Exec("UPDATE orders SET total_amount = $1 WHERE id = $2", finalTotal, orderID)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to update order total")
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to save order")
	}

	// Get complete order
	var order models.Order
	err = config.DB.QueryRow(`
        SELECT id, order_code, total_amount, status, payment_status, created_at, updated_at
        FROM orders WHERE order_code = $1
    `, orderCode).Scan(&order.ID, &order.OrderCode, &order.TotalAmount,
		&order.Status, &order.PaymentStatus, &order.CreatedAt, &order.UpdatedAt)

	response := models.OrderResponse{
		Order:      order,
		OrderItems: orderItems,
	}

	// Broadcast new order via WebSocket
	broadcastNewOrder(response)

	return utils.SuccessResponse(c, 201, "Order created successfully", response)
}

// ===== GET ALL ORDERS =====
func GetOrders(c *fiber.Ctx) error {
	status := c.Query("status")
	var rows *sql.Rows
	var err error

	if status != "" {
		rows, err = config.DB.Query(`
            SELECT id, order_code, total_amount, status, payment_status, created_at, updated_at
            FROM orders WHERE status = $1 ORDER BY created_at DESC
        `, status)
	} else {
		rows, err = config.DB.Query(`
            SELECT id, order_code, total_amount, status, payment_status, created_at, updated_at
            FROM orders ORDER BY created_at DESC
        `)
	}

	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to fetch orders")
	}
	defer rows.Close()

	var orders []models.OrderResponse
	for rows.Next() {
		var order models.Order
		err := rows.Scan(&order.ID, &order.OrderCode, &order.TotalAmount,
			&order.Status, &order.PaymentStatus, &order.CreatedAt, &order.UpdatedAt)
		if err != nil {
			continue
		}

		// Get order items
		itemRows, err := config.DB.Query(`
            SELECT id, order_id, menu_id, menu_code, menu_name, quantity, price, created_at
            FROM order_items WHERE order_id = $1
        `, order.ID)
		if err != nil {
			continue
		}

		var items []models.OrderItem
		for itemRows.Next() {
			var item models.OrderItem
			itemRows.Scan(&item.ID, &item.OrderID, &item.MenuID, &item.MenuCode,
				&item.MenuName, &item.Quantity, &item.Price, &item.CreatedAt)
			items = append(items, item)
		}
		itemRows.Close()

		orders = append(orders, models.OrderResponse{
			Order:      order,
			OrderItems: items,
		})
	}

	return utils.SuccessResponse(c, 200, "Orders fetched successfully", orders)
}

// ===== GET SINGLE ORDER =====
func GetOrder(c *fiber.Ctx) error {
	orderCode := c.Params("code")

	var order models.Order
	err := config.DB.QueryRow(`
        SELECT id, order_code, total_amount, status, payment_status, created_at, updated_at
        FROM orders WHERE order_code = $1
    `, orderCode).Scan(&order.ID, &order.OrderCode, &order.TotalAmount,
		&order.Status, &order.PaymentStatus, &order.CreatedAt, &order.UpdatedAt)

	if err == sql.ErrNoRows {
		return utils.ErrorResponse(c, 404, "Order not found")
	}
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to fetch order")
	}

	// Get order items
	rows, err := config.DB.Query(`
        SELECT id, order_id, menu_id, menu_code, menu_name, quantity, price, created_at
        FROM order_items WHERE order_id = $1
    `, order.ID)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to fetch order items")
	}
	defer rows.Close()

	var items []models.OrderItem
	for rows.Next() {
		var item models.OrderItem
		rows.Scan(&item.ID, &item.OrderID, &item.MenuID, &item.MenuCode,
			&item.MenuName, &item.Quantity, &item.Price, &item.CreatedAt)
		items = append(items, item)
	}

	response := models.OrderResponse{
		Order:      order,
		OrderItems: items,
	}

	return utils.SuccessResponse(c, 200, "Order fetched successfully", response)
}

// ===== UPDATE ORDER STATUS =====
func UpdateOrderStatus(c *fiber.Ctx) error {
	orderCode := c.Params("code")
	var req models.UpdateOrderStatusRequest

	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}

	validStatus := map[string]bool{
		"pending": true, "confirmed": true, "completed": true, "cancelled": true,
	}
	if !validStatus[req.Status] {
		return utils.ErrorResponse(c, 400, "Invalid status")
	}

	result, err := config.DB.Exec(`
        UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE order_code = $2
    `, req.Status, orderCode)

	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to update order status")
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return utils.ErrorResponse(c, 404, "Order not found")
	}

	// Broadcast status update via WebSocket
	broadcastOrderStatusUpdate(orderCode, req.Status)

	return utils.SuccessResponse(c, 200, "Order status updated successfully", nil)
}

// ===== DELETE ORDER =====
func DeleteOrder(c *fiber.Ctx) error {
	orderCode := c.Params("code")

	result, err := config.DB.Exec("DELETE FROM orders WHERE order_code = $1", orderCode)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to delete order")
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return utils.ErrorResponse(c, 404, "Order not found")
	}

	return utils.SuccessResponse(c, 200, "Order deleted successfully", nil)
}

// ===== HELPER: GENERATE ORDER CODE =====
func generateOrderCode() string {
	return fmt.Sprintf("ORD-%s", uuid.New().String()[:8])
}

// ===== HELPER: PARSE ORDER CODE STRING =====
// Parses format like "S1(2),S2(1)" or "S1(2), S2(1)"
// Removes all spaces, splits by comma, extracts CODE(QUANTITY)
// Format MUST be: MENU_CODE(QUANTITY) - Example: S1(2) = menu S1 quantity 2
func parseOrderCode(codeStr string) []models.OrderItemRequest {
	var items []models.OrderItemRequest

	fmt.Printf("DEBUG: Raw input: '%s'\n", codeStr)

	// Remove all spaces first
	cleanStr := strings.ReplaceAll(codeStr, " ", "")
	fmt.Printf("DEBUG: Cleaned (no spaces): '%s'\n", cleanStr)

	// Split by comma
	parts := strings.Split(cleanStr, ",")
	fmt.Printf("DEBUG: Parts: %v\n", parts)

	for _, part := range parts {
		if part == "" {
			continue
		}

		// Find parentheses positions
		openParen := strings.Index(part, "(")
		closeParen := strings.Index(part, ")")

		fmt.Printf("DEBUG: Processing part '%s', openParen=%d, closeParen=%d\n", part, openParen, closeParen)

		// Valid format: CODE(NUMBER)
		if openParen > 0 && closeParen > openParen {
			menuCode := part[:openParen]
			qtyStr := part[openParen+1 : closeParen]

			fmt.Printf("DEBUG: menuCode='%s', qtyStr='%s'\n", menuCode, qtyStr)

			// Validate menu code not empty
			if menuCode == "" {
				fmt.Printf("DEBUG: menuCode empty, skipping\n")
				continue
			}

			// Parse and validate quantity
			qty, err := strconv.Atoi(qtyStr)
			if err != nil || qty <= 0 {
				fmt.Printf("DEBUG: Invalid quantity: %s, error: %v\n", qtyStr, err)
				continue
			}

			items = append(items, models.OrderItemRequest{
				MenuCode: menuCode,
				Quantity: qty,
			})
			fmt.Printf("DEBUG: Added item: %+v\n", items[len(items)-1])
		} else {
			fmt.Printf("DEBUG: No parentheses found in '%s'\n", part)
		}
	}

	fmt.Printf("DEBUG: Final items count: %d\n", len(items))
	return items
}

// ===== WEBSOCKET BROADCAST: NEW ORDER =====
func broadcastNewOrder(order models.OrderResponse) {
	data, _ := json.Marshal(map[string]interface{}{
		"type":      "new_order",
		"order":     order,
		"timestamp": time.Now(),
	})

	for _, ch := range orderChannels {
		select {
		case ch <- data:
		default:
		}
	}
}

// ===== WEBSOCKET BROADCAST: STATUS UPDATE =====
func broadcastOrderStatusUpdate(orderCode, status string) {
	data, _ := json.Marshal(map[string]interface{}{
		"type":       "order_status_update",
		"order_code": orderCode,
		"status":     status,
		"timestamp":  time.Now(),
	})

	for _, ch := range orderChannels {
		select {
		case ch <- data:
		default:
		}
	}
}

// ===== WEBSOCKET REGISTRATION =====
func RegisterOrderChannel(orderCode string, ch chan []byte) {
	orderChannels[orderCode] = ch
}

// ===== WEBSOCKET UNREGISTRATION =====
func UnregisterOrderChannel(orderCode string) {
	delete(orderChannels, orderCode)
}

// ===== HELPER: CALCULATE FINAL TOTAL (TAX + ROUNDING) =====
func calculateFinalTotal(subtotal float64) float64 {
	totalWithTax := subtotal * 1.10
	return math.Round(totalWithTax/1000.0) * 1000.0
}