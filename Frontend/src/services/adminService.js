// src/services/adminService.js
// import axios from "axios";

// const API_URL = "http://localhost:5000/api";

// export const adminService = {
// 	// Get all users (admin only)
// 	getUsers: async () => {
// 		const response = await axios.get(`${API_URL}/admin/users`);
// 		return response.data;
// 	},

// 	// Delete a user (admin only)
// 	deleteUser: async (userId) => {
// 		const response = await axios.delete(`${API_URL}/users/${userId}`);
// 		return response.data;
// 	},

// 	// Get all products (admin only)
// 	getProducts: async () => {
// 		const response = await axios.get(`${API_URL}/products`);
// 		return response.data;
// 	},

// 	// Add a new product (admin only)
// 	addProduct: async (product) => {
// 		const response = await axios.post(`${API_URL}/products`, product);
// 		return response.data;
// 	},

// 	// Delete a product (admin only)
// 	deleteProduct: async (productId) => {
// 		const response = await axios.delete(`${API_URL}/products/${productId}`);
// 		return response.data;
// 	},
// };

// src/services/adminService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Utility function to get the token
const getToken = () => {
    return localStorage.getItem("authToken"); // Or sessionStorage depending on where the token is stored
};

export const adminService = {
    // Get all users (admin only)
    getUsers: async () => {
        const token = getToken();
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Delete a user (admin only)
    deleteUser: async (userId) => {
        const token = getToken();
        const response = await axios.delete(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Get all products (admin only)
    getProducts: async () => {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    },

    // Add a new product (admin only)
    addProduct: async (product) => {
        const token = getToken();
        console.log(product);

        try {
            const response = await axios.post(`${API_URL}/products`, product, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Make sure the content type is set to multipart/form-data
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    // Delete a product (admin only)
    deleteProduct: async (productId) => {
        const token = getToken();
        const response = await axios.delete(
            `${API_URL}/products/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },
    getCategories: async () => {
        const token = getToken();
        try {
            const response = await axios.get(`${API_URL}/products/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(token);
            return response.data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
