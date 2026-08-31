package models

import "time"

type Order struct {
    ID            int       `json:"id"`
    OrderCode     string    `json:"order_code"`
    TotalAmount   float64   `json:"total_amount"`
    Status        string    `json:"status"`
    PaymentStatus string    `json:"payment_status"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}

type OrderItem struct {
    ID        int       `json:"id"`
    OrderID   int       `json:"order_id"`
    MenuID    int       `json:"menu_id"`
    MenuCode  string    `json:"menu_code"`
    MenuName  string    `json:"menu_name"`
    Quantity  int       `json:"quantity"`
    Price     float64   `json:"price"`
    CreatedAt time.Time `json:"created_at"`
}

type CreateOrderRequest struct {
    Items         []OrderItemRequest `json:"items" validate:"required"`
    Status        string             `json:"status"`
    PaymentStatus string             `json:"payment_status"`
}

type OrderItemRequest struct {
    MenuCode string `json:"menu_code" validate:"required"`
    Quantity int    `json:"quantity" validate:"required,min=1"`
}

type OrderResponse struct {
    Order        Order        `json:"order"`
    OrderItems   []OrderItem  `json:"order_items"`
}

type UpdateOrderStatusRequest struct {
    Status string `json:"status" validate:"required"`
}