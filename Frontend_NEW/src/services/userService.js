// Frontend/src/services/cartService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

export const cartService = {
    // Add an item to the cart
    addItemToCart: async (productId) => {
        try {
            const response = await axios.post(
                `${API_URL}/add`,
                { product_id: productId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error adding item to cart"
            );
        }
    },

    // Get all cart items with pagination
    getCart: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(
                `${API_URL}?page=${page}&limit=${limit}`,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error fetching cart"
            );
        }
    },

    // Update a cart item's quantity
    updateCart: async (productId, quantity) => {
        try {
            const response = await axios.put(
                `${API_URL}/update`,
                { product_id: productId, quantity },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error updating cart item"
            );
        }
    },

    // Remove an item from the cart
    removeItemFromCart: async (productId) => {
        try {
            const response = await axios.delete(
                `${API_URL}/remove/${productId}`,
                {
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
    incrementQuantity: async (productId) => {
        try {
            const response = await axios.patch(
                `${API_URL}/increment`,
                { product_id: productId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error incrementing quantity"
            );
        }
    },

    // Decrement the quantity of a cart item
    decrementQuantity: async (productId) => {
        try {
            const response = await axios.patch(
                `${API_URL}/decrement`,
                { product_id: productId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error decrementing quantity"
            );
        }
    },

    // Clear all items from the cart
    clearCart: async () => {
        try {
            const response = await axios.delete(`${API_URL}/clear`, {
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
    getCartTotal: async () => {
        try {
            const response = await axios.get(`${API_URL}/total`, {
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
    checkCartItemQuantity: async (productId) => {
        try {
            const response = await axios.get(`${API_URL}/check-quantity`, {
                params: { product_id: productId },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message ||
                    "Error checking cart item quantity"
            );
        }
    },

    // Get product recommendations based on the cart
    getProductRecommendations: async () => {
        try {
            const response = await axios.get(`${API_URL}/recommendations`, {
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
