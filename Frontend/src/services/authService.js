// src/services/authService.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export const authService = {
  // Login function
  login: async (credentials) => {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    return response.data;
  },

  // Signup function
  signup: async (data) => {
    const response = await axios.post(`${BASE_URL}/signup`, data);
    return response.data;
  },
};
