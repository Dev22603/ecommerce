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

	// Get all products with pagination (admin only)
	getProducts: async (page = 1, limit = 10) => {
		console.log();
		
		try {
			const response = await axios.get(`${API_URL}/products`, {
				params: { page, limit }, // Send pagination parameters
			});
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error fetching products"
			);
		}
	},

	// Add a new product (admin only)
	addProduct: async (product, token) => {
		try {
			const response = await axios.post(`${API_URL}/products`, product, {
				headers: {
					Authorization: `Bearer ${token}`, // Include the token in the headers
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (error) {
			console.error("Error adding product:", error);
			throw error; // Optionally, throw the error to handle it in the calling function
		}
	},
	// Delete a product (admin only)
	deleteProduct: async (productId, token) => {
		const response = await axios.delete(
			`${API_URL}/products/${productId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`, // Include the token in the headers
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	},
};
