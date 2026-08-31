package middleware

import (
	"solaria-backend/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get cookie
		cookie := c.Cookies("jwt")
		if cookie == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthenticated",
			})
		}

		// Parse token
		token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
			return utils.GetJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthenticated",
			})
		}

		// Set Context
		claims := token.Claims.(jwt.MapClaims)
		c.Locals("adminID", claims["id"])
		c.Locals("username", claims["username"])

		return c.Next()
	}
}
