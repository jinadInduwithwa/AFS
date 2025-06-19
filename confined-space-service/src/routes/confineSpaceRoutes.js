// confine-space-service/src/routes/confineSpace.routes.js
import express from "express";
import { ConfineSpaceController } from "../controllers/confineSpace.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();
const confineSpaceController = new ConfineSpaceController();

// Public route (no authentication)
router.post("/", authenticate, authorize("ADMIN"), confineSpaceController.createOrder);

// Admin-only route (requires authentication and ADMIN role)
router.get("/", authenticate, authorize("ADMIN"), confineSpaceController.getOrders);

// User-specific routes (requires authentication)
router.get("/user/:userId", authenticate, authorize("ADMIN"),  confineSpaceController.getOrdersByUserId);
router.get("/my-orders", authenticate, confineSpaceController.getMyOrders);

// Order-specific routes (requires authentication-Admin only)
router.get("/:id", authenticate, authorize("ADMIN"), confineSpaceController.getOrderById);
router.patch("/:id", authenticate, authorize("ADMIN"), confineSpaceController.updateOrder);
router.delete("/:id", authenticate, authorize("ADMIN"), confineSpaceController.deleteOrder);

// Admin-only search route
router.get("/search", authenticate, authorize("ADMIN"), confineSpaceController.searchOrders);

export default router;