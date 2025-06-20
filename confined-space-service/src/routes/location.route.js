import express from "express";
import { LocationController } from "../controllers/location.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  validateCreateLocation,
  validateUpdateLocation,
} from "../validation/location.validation.js";

const router = express.Router();
const locationController = new LocationController();

// Create a new location (authenticated users)
router.post("/", authenticate, authorize("ADMIN"), validateCreateLocation, locationController.createLocation);

// Update a location (admin only)
router.patch("/:id", authenticate, authorize("ADMIN"), validateUpdateLocation, locationController.updateLocation);

// Delete a location (admin only)
router.delete("/:id", authenticate, authorize("ADMIN"), locationController.deleteLocation);

// Get a single location by ID (authenticated users)
router.get("/:id", authenticate, locationController.getLocationById);

// Get all locations (authenticated users)
router.get("/", authenticate, locationController.getAllLocations);

export default router;