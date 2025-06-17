import express from "express";
import { ConfineSpaceController } from "../controllers/confineSpace.controller.js";

const router = express.Router();
const confineSpaceController = new ConfineSpaceController();

// Create a new order
router.post("/", confineSpaceController.createOrder);

// Get all orders (admin)
router.get("/", confineSpaceController.getOrders);

// Get orders by userId
router.get("/user/:userId", confineSpaceController.getOrdersByUserId);

// Get logged-in user's orders
router.get("/my-orders", confineSpaceController.getMyOrders);

// Get a single order by ID
router.get("/:id", confineSpaceController.getOrderById);

// Update an order by ID
router.patch("/:id", confineSpaceController.updateOrder);

// Delete an order by ID
router.delete("/:id", confineSpaceController.deleteOrder);

// Search orders by query parameters
router.get("/search", confineSpaceController.searchOrders);

export default router;