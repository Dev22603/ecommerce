// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const productService = {
  // Get all products (accessible to everyone)
  getProducts: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get a single product by ID (accessible to everyone)
  getProductById: async (productId) => {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  },
};
