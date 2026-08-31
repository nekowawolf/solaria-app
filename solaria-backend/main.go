package main

import (
	"log"
	"os"
	"solaria-backend/config"
	"solaria-backend/middleware"
	"solaria-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to database
	config.ConnectDatabase()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Restaurant Backend API",
	})

	// Middleware
	app.Use(middleware.Cors())

	// Setup routes
	routes.SetupRoutes(app)

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		panic(err)
	}
}
