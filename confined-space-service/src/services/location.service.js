import { Location } from "../models/location.model.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class LocationService {
  async createLocation(locationData) {
    try {
      const location = new Location({ ...locationData });
      const savedLocation = await location.save();
      logger.info(`Location created successfully: ${savedLocation._id}`);
      return savedLocation;
    } catch (err) {
      logger.error(`Error creating location: ${err.message}`);
      throw new AppError(err.message, 400);
    }
  }

  async updateLocation(id, updateData, user) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid location ID: ${id}`);
        throw new AppError("Invalid location ID", 400);
      }
      const location = await Location.findById(id);
      if (!location) {
        logger.warn(`Location not found: ${id}`);
        throw new AppError("Location not found", 404);
      }
      if (user.role !== "ADMIN") {
        logger.warn(`Unauthorized update attempt by user: ${user.id}`);
        throw new AppError("Unauthorized to update location", 403);
      }
      const updatedLocation = await Location.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      logger.info(`Updated location: ${id}`);
      return updatedLocation;
    } catch (err) {
      logger.error(`Error updating location ${id}: ${err.message}`);
      throw err.statusCode ? err : new AppError(err.message, 400);
    }
  }

  async deleteLocation(id, user) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid location ID: ${id}`);
        throw new AppError("Invalid location ID", 400);
      }
      const location = await Location.findById(id);
      if (!location) {
        logger.warn(`Location not found: ${id}`);
        throw new AppError("Location not found", 404);
      }
      if (user.role !== "ADMIN") {
        logger.warn(`Unauthorized delete attempt by user: ${user.id}`);
        throw new AppError("Unauthorized to delete location", 403);
      }
      await Location.findByIdAndDelete(id);
      logger.info(`Deleted location: ${id}`);
      return { message: "Location deleted successfully" };
    } catch (err) {
      logger.error(`Error deleting location ${id}: ${err.message}`);
      throw err.statusCode ? err : new AppError(err.message, 500);
    }
  }

  async getLocationById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn(`Invalid location ID: ${id}`);
        throw new AppError("Invalid location ID", 400);
      }
      const location = await Location.findById(id);
      if (!location) {
        logger.warn(`Location not found: ${id}`);
        throw new AppError("Location not found", 404);
      }
      logger.info(`Fetched location: ${id}`);
      return location;
    } catch (err) {
      logger.error(`Error fetching location ${id}: ${err.message}`);
      throw err.statusCode ? err : new AppError(err.message, 500);
    }
  }

  async getAllLocations() {
    try {
      const locations = await Location.find();
      logger.info(`Fetched ${locations.length} locations`);
      return locations;
    } catch (err) {
      logger.error(`Error fetching locations: ${err.message}`);
      throw new AppError(err.message, 500);
    }
  }
}