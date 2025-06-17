import { Order } from "../models/order.model.js";
import logger from "../utils/logger.js";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConfineSpaceService {
  constructor() {}

  async createOrder(orderData) {
    try {
      const order = new Order({ ...orderData });
      const savedOrder = await order.save();
      logger.info(`Order created successfully: ${savedOrder._id}`);
      return savedOrder;
    } catch (err) {
      logger.error(`Error creating order: ${err.message}`);
      throw new AppError(err.message, 400);
    }
  }

  async getAllOrders() {
    try {
      const orders = await Order.find();
      logger.info(`Fetched ${orders.length} orders`);
      return orders;
    } catch (err) {
      logger.error(`Error fetching orders: ${err.message}`);
      throw new AppError(err.message, 500);
    }
  }

  async getOrdersByUserId(userId) {
    try {
      logger.info(`Fetching orders for userId: ${userId}`);
      const orders = await Order.find({ userId });
      logger.info(`Fetched ${orders.length} orders for userId: ${userId}`);
      return orders;
    } catch (err) {
      logger.error(`Error fetching orders for userId ${userId}: ${err.message}`);
      throw new AppError(err.message, 500);
    }
  }

  async getOrderById(id) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        logger.warn(`Order not found: ${id}`);
        throw new AppError("Order not found", 404);
      }
      logger.info(`Fetched order: ${id}`);
      return order;
    } catch (err) {
      logger.error(`Error fetching order ${id}: ${err.message}`);
      throw err.statusCode ? err : new AppError(err.message, 500);
    }
  }

  async updateOrder(id, updateData) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedOrder) {
        logger.warn(`Order not found for update: ${id}`);
        throw new AppError("Order not found", 404);
      }
      logger.info(`Updated order: ${id}`);
      return updatedOrder;
    } catch (err) {
      logger.error(`Error updating order ${id}: ${err.message}`);
      throw err.statusCode ? err : new AppError(err.message, 400);
    }
  }

  async deleteOrder(id) {
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        logger.warn(`Order not found for deletion: ${id}`);
        throw new AppError("Order not found", 404);
      }
      logger.info(`Deleted order: ${id}`);
      return { message: "Order deleted successfully" };
    } catch (err) {
      logger.error(`Error deleting order ${id}: ${err.message}`);
      throw err.statusCode ? err : new AppError(err.message, 500);
    }
  }

  async searchOrders(queryParams) {
    try {
      const query = {};

      if (queryParams.dateOfSurvey) query.dateOfSurvey = new Date(queryParams.dateOfSurvey);
      if (queryParams.surveyor) query.surveyors = { $in: [queryParams.surveyor] };
      if (queryParams.confinedSpaceNameOrId) {
        query.confinedSpaceNameOrId = {
          $regex: queryParams.confinedSpaceNameOrId,
          $options: "i",
        };
      }
      if (queryParams.building) {
        query.building = { $regex: queryParams.building, $options: "i" };
      }

      const orders = await Order.find(query);
      logger.info(`Searched orders with query: ${JSON.stringify(queryParams)}`);
      return orders;
    } catch (err) {
      logger.error(`Error searching orders: ${err.message}`);
      throw new AppError(err.message, 500);
    }
  }
}