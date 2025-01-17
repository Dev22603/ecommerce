// src/services/adminService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

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

	// Get all products (admin only)
	getAdminProducts: async () => {
		const response = await axios.get(`${API_URL}/products`);
		return response.data;
	},

	// Add a new product (admin only)
	addProduct: async (product) => {
		const response = await axios.post(`${API_URL}/products`, product);
		return response.data;
	},

	// Delete a product (admin only)
	deleteProduct: async (productId) => {
		const response = await axios.delete(`${API_URL}/products/${productId}`);
		return response.data;
	},
};
