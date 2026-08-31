package controllers

import (
    "database/sql"
    "solaria-backend/config"
    "solaria-backend/models"
    "solaria-backend/utils"
    "strconv"

    "github.com/gofiber/fiber/v2"
)

// Get all menus
func GetMenus(c *fiber.Ctx) error {
    rows, err := config.DB.Query(`
        SELECT id, code, name, description, price, image_url, category, created_at, updated_at 
        FROM menus ORDER BY id
    `)
    if err != nil {
        return utils.ErrorResponse(c, 500, "Failed to fetch menus")
    }
    defer rows.Close()

    var menus []models.Menu
    for rows.Next() {
        var menu models.Menu
        err := rows.Scan(&menu.ID, &menu.Code, &menu.Name, &menu.Description, 
            &menu.Price, &menu.ImageURL, &menu.Category, &menu.CreatedAt, &menu.UpdatedAt)
        if err != nil {
            return utils.ErrorResponse(c, 500, "Error scanning menu")
        }
        menus = append(menus, menu)
    }

    return utils.SuccessResponse(c, 200, "Menus fetched successfully", menus)
}

// Get single menu
func GetMenu(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return utils.ErrorResponse(c, 400, "Invalid menu ID")
    }

    var menu models.Menu
    err = config.DB.QueryRow(`
        SELECT id, code, name, description, price, image_url, category, created_at, updated_at 
        FROM menus WHERE id = $1
    `, id).Scan(&menu.ID, &menu.Code, &menu.Name, &menu.Description, 
        &menu.Price, &menu.ImageURL, &menu.Category, &menu.CreatedAt, &menu.UpdatedAt)

    if err == sql.ErrNoRows {
        return utils.ErrorResponse(c, 404, "Menu not found")
    }
    if err != nil {
        return utils.ErrorResponse(c, 500, "Failed to fetch menu")
    }

    return utils.SuccessResponse(c, 200, "Menu fetched successfully", menu)
}

// Create new menu
func CreateMenu(c *fiber.Ctx) error {
    var req models.CreateMenuRequest
    if err := c.BodyParser(&req); err != nil {
        return utils.ErrorResponse(c, 400, "Invalid request body")
    }

    var exists bool
    err := config.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM menus WHERE code = $1)", req.Code).Scan(&exists)
    if err != nil {
        return utils.ErrorResponse(c, 500, "Database error")
    }
    if exists {
        return utils.ErrorResponse(c, 400, "Menu code already exists")
    }

    var menu models.Menu
    err = config.DB.QueryRow(`
        INSERT INTO menus (code, name, description, price, image_url, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, code, name, description, price, image_url, category, created_at, updated_at
    `, req.Code, req.Name, req.Description, req.Price, req.ImageURL, req.Category).
        Scan(&menu.ID, &menu.Code, &menu.Name, &menu.Description, &menu.Price, 
            &menu.ImageURL, &menu.Category, &menu.CreatedAt, &menu.UpdatedAt)

    if err != nil {
        return utils.ErrorResponse(c, 500, "Failed to create menu")
    }

    return utils.SuccessResponse(c, 201, "Menu created successfully", menu)
}

// Update menu
func UpdateMenu(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return utils.ErrorResponse(c, 400, "Invalid menu ID")
    }

    var req models.UpdateMenuRequest
    if err := c.BodyParser(&req); err != nil {
        return utils.ErrorResponse(c, 400, "Invalid request body")
    }

    result, err := config.DB.Exec(`
        UPDATE menus 
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            image_url = COALESCE($4, image_url),
            category = COALESCE($5, category),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
    `, req.Name, req.Description, req.Price, req.ImageURL, req.Category, id)

    if err != nil {
        return utils.ErrorResponse(c, 500, "Failed to update menu")
    }

    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return utils.ErrorResponse(c, 404, "Menu not found")
    }

    return utils.SuccessResponse(c, 200, "Menu updated successfully", nil)
}

// Delete menu
func DeleteMenu(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return utils.ErrorResponse(c, 400, "Invalid menu ID")
    }

    result, err := config.DB.Exec("DELETE FROM menus WHERE id = $1", id)
    if err != nil {
        return utils.ErrorResponse(c, 500, "Failed to delete menu")
    }

    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        return utils.ErrorResponse(c, 404, "Menu not found")
    }

    return utils.SuccessResponse(c, 200, "Menu deleted successfully", nil)
}