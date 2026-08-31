package controllers

import (
	"database/sql"
	"time"

	"solaria-backend/config"
	"solaria-backend/models"
	"solaria-backend/utils"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	var input models.LoginRequest

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var admin models.Admin
	err := config.DB.QueryRow("SELECT id, username, password FROM admins WHERE username = $1", input.Username).
		Scan(&admin.ID, &admin.Username, &admin.Password)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid credentials",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	// Plaintext comparison as requested by the user
	if admin.Password != input.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Generate JWT
	token, err := utils.GenerateToken(admin.ID, admin.Username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	// Set HttpOnly Cookie
	cookie := new(fiber.Cookie)
	cookie.Name = "jwt"
	cookie.Value = token
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.HTTPOnly = true
	cookie.SameSite = "Lax"
	cookie.Secure = false   
	cookie.Path = "/"       
	
	c.Cookie(cookie)

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"id":       admin.ID,
			"username": admin.Username,
		},
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := new(fiber.Cookie)
	cookie.Name = "jwt"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-time.Hour) 
	cookie.HTTPOnly = true
	cookie.Path = "/"

	c.Cookie(cookie)

	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

// Me returns the current authenticated user's ID and Username from the JWT context
func Me(c *fiber.Ctx) error {
	adminID := c.Locals("adminID")
	username := c.Locals("username")

	return c.JSON(fiber.Map{
		"id":       adminID,
		"username": username,
	})
}