// src/services/adminService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const adminService = {
    // Get all users (admin only)
    getUsers: async () => {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    },

    // Delete a user (admin only)
    deleteUser: async (userId) => {
        const response = await axios.delete(`${API_URL}/users/${userId}`);
        return response.data;
    },
};
