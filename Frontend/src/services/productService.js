// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const productService = {
    // Get all products with pagination (accessible to everyone)
    getProducts: async (page = 1, limit = 10) => {
        try {
            const response = await axios.get(`${API_URL}/`, {
                params: { page, limit }, // Send pagination parameters
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error fetching products"
            );
        }
    },

    // Get a single product by ID (accessible to everyone)
    getProductById: async (productId) => {
        const response = await axios.get(`${API_URL}/id/${productId}`);
        return response.data;
    },
    // Add a new product (admin only)
    addProduct: async (product, token) => {
        try {
            const response = await axios.post(`${API_URL}/`, product, {
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
    // Update an existing product (admin only)
    updateProduct: async (productId, productData, token) => {
        const response = await axios.put(
            `${API_URL}/${productId}`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    // Delete a product by ID (admin only)
    deleteProduct: async (productId, token) => {
        const response = await axios.delete(
            `${API_URL}/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    },

    // Get products by name (with pagination)
    getProductsByName: async (name, page = 1, limit = 12) => {
        const response = await axios.get(
            `${API_URL}/product_name/${name}`,
            { params: { page, limit } } // Include page and limit as query parameters
        );
        return response.data;
    },

    // Get products by ws_code (with pagination)
    getProductsByWsCode: async (wsCode, page = 1, limit = 12) => {
        const response = await axios.get(
            `${API_URL}/ws_code/${wsCode}`,
            { params: { page, limit } } // Include page and limit as query parameters
        );
        return response.data;
    },

    // Get all categories (admin only)
    getCategories: async (token) => {
        const response = await axios.get(`${API_URL}/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // Create a new category (admin only)
    createCategory: async (categoryData, token) => {
        const response = await axios.post(
            `${API_URL}/newCategory`,
            categoryData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },
};
