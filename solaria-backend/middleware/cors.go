package middleware

import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
)

func Cors() fiber.Handler {
    return cors.New(cors.Config{
        AllowOrigins:     "http://localhost:3001,http://localhost:3000,http://192.168.68.116:3000,http://192.168.68.116:3001",
        AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
        AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
        AllowCredentials: true,
    })
}