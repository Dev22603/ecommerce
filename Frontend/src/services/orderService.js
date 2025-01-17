// Frontend\src\services\orderService.js

// Frontend\src\services\orderService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";


export const orderService = {
  // Create a new order from the cart
  createOrder: async (token) => {
    try {
      const response = await axios.post(
        `${API_URL}/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // Fetch all orders for the logged-in user
  getUserOrders: async (token, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_URL}?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // Fetch details of a specific order
  getOrderDetails: async (token, orderId) => {
    try {
      const response = await axios.get(
        `${API_URL}/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // Cancel an order
  cancelOrder: async (token, orderId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // Update the status of an order (admin only)
  updateOrderStatus: async (token, orderId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // Fetch all orders (admin only)
  getAllOrders: async (token, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/all?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },
};
