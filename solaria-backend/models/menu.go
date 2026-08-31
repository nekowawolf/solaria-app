package models

import "time"

type Menu struct {
    ID          int       `json:"id"`
    Code        string    `json:"code"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    Price       float64   `json:"price"`
    ImageURL    string    `json:"image_url"`
    Category    string    `json:"category"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}

type CreateMenuRequest struct {
    Code        string  `json:"code" validate:"required"`
    Name        string  `json:"name" validate:"required"`
    Description string  `json:"description"`
    Price       float64 `json:"price" validate:"required"`
    ImageURL    string  `json:"image_url"`
    Category    string  `json:"category" validate:"required"`
}

type UpdateMenuRequest struct {
    Name        string  `json:"name"`
    Description string  `json:"description"`
    Price       float64 `json:"price"`
    ImageURL    string  `json:"image_url"`
    Category    string  `json:"category"`
}