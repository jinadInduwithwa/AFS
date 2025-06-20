import { LocationService } from "../services/location.service.js";
import logger from "../utils/logger.js";

const locationService = new LocationService();

export class LocationController {
  async createLocation(req, res) {
    try {
      const savedLocation = await locationService.createLocation(req.body);
      res.status(201).json(savedLocation);
    } catch (err) {
      logger.error(`Error in createLocation: ${err.message}`);
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }

  async updateLocation(req, res) {
    try {
      const updatedLocation = await locationService.updateLocation(
        req.params.id,
        req.body,
        req.user
      );
      res.json(updatedLocation);
    } catch (err) {
      logger.error(`Error in updateLocation: ${err.message}`);
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }

  async deleteLocation(req, res) {
    try {
      const result = await locationService.deleteLocation(req.params.id, req.user);
      res.json(result);
    } catch (err) {
      logger.error(`Error in deleteLocation: ${err.message}`);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getLocationById(req, res) {
    try {
      const location = await locationService.getLocationById(req.params.id);
      res.json(location);
    } catch (err) {
      logger.error(`Error in getLocationById: ${err.message}`);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getAllLocations(req, res) {
    try {
      const locations = await locationService.getAllLocations();
      res.json(locations);
    } catch (err) {
      logger.error(`Error in getAllLocations: ${err.message}`);
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}