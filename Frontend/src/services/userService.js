// src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const userService = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get a single user by ID (admin only)
  getUserById: async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  },
};
