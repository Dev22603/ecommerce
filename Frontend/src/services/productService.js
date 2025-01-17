// // src/services/productService.js
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/products";

// export const productService = {
//   // Get all products (accessible to everyone)
//   getProducts: async () => {
//     const response = await axios.get(API_URL);
//     return response.data;
//   },

//   // Get a single product by ID (accessible to everyone)
//   getProductById: async (productId) => {
//     const response = await axios.get(`${API_URL}/${productId}`);
//     return response.data;
//   },
// };

// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const productService = {
    // Get all products with pagination (accessible to everyone)
    getProducts: async (page = 1, limit = 12) => {
        // Default page 1, limit 12
        const response = await axios.get(API_URL, {
            params: { page, limit }, // Send page and limit as query parameters
        });
        console.log(response.data);

        return response.data; // Ensure the response includes products and pagination info
    },

    // Get a single product by ID (accessible to everyone)
    getProductById: async (productId) => {
        const response = await axios.get(`${API_URL}/id/${productId}`);
        return response.data;
    },

    // Create a new product (admin only)
    createProduct: async (productData, token) => {
        const formData = new FormData();
        for (const key in productData) {
            if (key === "images") {
                productData.images.forEach((image) => {
                    formData.append("images", image);
                });
            } else {
                formData.append(key, productData[key]);
            }
        }
        const response = await axios.post(API_URL, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    // Update an existing product (admin only)
    updateProduct: async (productId, productData, token) => {
        const formData = new FormData();
        for (const key in productData) {
            if (key === "images") {
                productData.images.forEach((image) => {
                    formData.append("images", image);
                });
            } else {
                formData.append(key, productData[key]);
            }
        }
        const response = await axios.put(`${API_URL}/${productId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    // Delete a product by ID (admin only)
    deleteProduct: async (productId, token) => {
        const response = await axios.delete(`${API_URL}/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    // // Get products by name (accessible to everyone)
    // getProductsByName: async (name) => {
    //   const response = await axios.get(`${API_URL}/product_name/${name}`);
    //   return response.data;
    // },

    // // Get products by ws_code (accessible to everyone)
    // getProductsByWsCode: async (wsCode) => {
    //   const response = await axios.get(`${API_URL}/ws_code/${wsCode}`);
    //   return response.data;
    // },
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
