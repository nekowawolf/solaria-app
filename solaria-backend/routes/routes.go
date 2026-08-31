package routes

import (
	"solaria-backend/controllers"
	"solaria-backend/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth routes
	api.Post("/login", controllers.Login)
	api.Post("/logout", controllers.Logout)
	api.Get("/me", middleware.AuthRequired(), controllers.Me)

	// Menu routes
	menuRoutes := api.Group("/menus")
	menuRoutes.Get("/", controllers.GetMenus)         
	menuRoutes.Get("/:id", controllers.GetMenu)       
	menuRoutes.Post("/", middleware.AuthRequired(), controllers.CreateMenu)
	menuRoutes.Put("/:id", middleware.AuthRequired(), controllers.UpdateMenu)
	menuRoutes.Delete("/:id", middleware.AuthRequired(), controllers.DeleteMenu)

	// Order routes
	orderRoutes := api.Group("/orders")
	orderRoutes.Post("/", controllers.CreateOrder)                
	orderRoutes.Post("/from-code", controllers.CreateOrderFromCode) 
	orderRoutes.Get("/", middleware.AuthRequired(), controllers.GetOrders)         
	orderRoutes.Get("/:code", controllers.GetOrder)              
	orderRoutes.Put("/:code/status", middleware.AuthRequired(), controllers.UpdateOrderStatus)
	orderRoutes.Delete("/:code", middleware.AuthRequired(), controllers.DeleteOrder)

	// WebSocket routes
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/admin/:id", websocket.New(controllers.WebSocketAdminHandler))
	app.Get("/ws/cashier", websocket.New(controllers.WebSocketCashierHandler))
}