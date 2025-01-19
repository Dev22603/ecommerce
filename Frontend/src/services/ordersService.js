import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const orderService = {
	// Create an order from the cart
	createOrder: async (token) => {
		console.log(token);

		try {
			const response = await axios.post(
				`${API_URL}/create`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error creating order"
			);
		}
	},

	// Get all orders for the logged-in user (with pagination)
	getUserOrders: async (token, page = 1, limit = 5) => {
		try {
			const response = await axios.get(`${API_URL}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
				params: { page, limit },
			});
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error fetching user orders"
			);
		}
	},

	// Get details of a specific order
	getOrderDetails: async (token, orderId) => {
		try {
			const response = await axios.get(`${API_URL}/${orderId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error fetching order details"
			);
		}
	},

	// Cancel a specific order
	cancelOrder: async (token, orderId) => {
		try {
			const response = await axios.delete(`${API_URL}/${orderId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error canceling order"
			);
		}
	},

	// Update the status of a specific order (admin only)
	updateOrderStatus: async (token, orderId, status) => {
		try {
			const response = await axios.patch(
				`${API_URL}/${orderId}/status`,
				{ status },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error updating order status"
			);
		}
	},

	// Get all orders (admin only, with pagination)
	getAllOrders: async (token, page = 1, limit = 10) => {
		try {
			const response = await axios.get(`${API_URL}/admin/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
				params: { page, limit },
			});
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error fetching all orders"
			);
		}
	},
	// Modified service in orderService.js
	getUserOrdersByDate: async (
		token,
		page = 1,
		limit = 5,
		startDate,
		endDate
	) => {
		try {
			const response = await axios.get(`${API_URL}/filter`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
				params: {
					page,
					limit,
					start_date: startDate,
					end_date: endDate,
				},
			});
			return response.data;
		} catch (error) {
			throw new Error(
				error.response?.data?.message || "Error fetching user orders"
			);
		}
	},
};
