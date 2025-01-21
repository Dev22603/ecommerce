// Frontend\src\services\cartService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/cart"; // Adjust this to match your backend server URL

export const cartService = {
    // Add an item to the cart
    addItemToCart: async (productId, token) => {
        try {
            const response = await axios.post(
                `${API_URL}/add`,
                { product_id: productId },
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
                error.response?.data?.message || "Error adding item to cart"
            );
        }
    },

    // Get all cart items with pagination
    getCart: async (page = 1, limit = 100, token) => {
        try {
            const response = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error fetching cart"
            );
        }
    },

    // Update a cart item's quantity
    updateCart: async (productId, quantity, token) => {
        try {
            const response = await axios.put(
                `${API_URL}/update`,
                { product_id: productId, quantity },
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
                error.response?.data?.message || "Error updating cart item"
            );
        }
    },

    // Remove an item from the cart
    removeItemFromCart: async (productId, token) => {
        try {
            const response = await axios.delete(
                `${API_URL}/remove/${productId}`,
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
                error.response?.data?.message || "Error removing item from cart"
            );
        }
    },

    // Increment the quantity of a cart item
    incrementQuantity: async (productId, token) => {
        try {
            const response = await axios.patch(
                `${API_URL}/increment`,
                { product_id: productId },
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
                error.response?.data?.message || "Error incrementing quantity"
            );
        }
    },

    // Decrement the quantity of a cart item
    decrementQuantity: async (productId, token) => {
        try {
            const response = await axios.patch(
                `${API_URL}/decrement`,
                { product_id: productId },
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
                error.response?.data?.message || "Error decrementing quantity"
            );
        }
    },

    // Clear all items from the cart
    clearCart: async (token) => {
        try {
            const response = await axios.delete(`${API_URL}/clear`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error clearing cart"
            );
        }
    },

    // Get the total cost of the cart
    getCartTotal: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/total`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error fetching cart total"
            );
        }
    },

    // Check if a product is in the cart and return its quantity
    checkCartItemQuantity: async (productId, token) => {
        if (!productId || !token) {
            throw new Error("Product ID and token are required");
        }
        try {
            const response = await axios.post(
                `${API_URL}/check-quantity`,
                { product_id: productId },
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
                error.response?.data?.message ||
                    "Error checking cart item quantity"
            );
        }
    },

    // Get product recommendations based on the cart
    getProductRecommendations: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/recommendations`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                    "Error fetching product recommendations"
            );
        }
    },
};
