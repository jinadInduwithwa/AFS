import { ConfineSpaceService } from "../services/confineSpace.service.js"
import logger from "../utils/logger.js";

const confineSpaceService = new ConfineSpaceService();

export class ConfineSpaceController {
  async createOrder(req, res) {
    try {
      const savedOrder = await confineSpaceService.createOrder(req.body);
      res.status(201).json(savedOrder);
    } catch (err) {
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await confineSpaceService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getOrdersByUserId(req, res) {
    try {
      const orders = await confineSpaceService.getOrdersByUserId(req.params.userId);
      res.json(orders);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await confineSpaceService.getOrdersByUserId(req.user.id);
      res.json(orders);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await confineSpaceService.getOrderById(req.params.id);
      res.json(order);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async updateOrder(req, res) {
    try {
      const updatedOrder = await confineSpaceService.updateOrder(req.params.id, req.body);
      res.json(updatedOrder);
    } catch (err) {
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const result = await confineSpaceService.deleteOrder(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async searchOrders(req, res) {
    try {
      const orders = await confineSpaceService.searchOrders(req.query);
      res.json(orders);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}