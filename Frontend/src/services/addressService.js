import axios from "axios";

const API_URL = "http://localhost:5000/api/address";

export const addressService = {
    // Get all addresses for the logged-in user
    getAddresses: async (token) => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.addresses || [];
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error fetching addresses"
            );
        }
    },

    // Create a new address
    createAddress: async (token, addressData) => {
        try {
            const response = await axios.post(API_URL, addressData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.address;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error creating address"
            );
        }
    },

    // Update an address
    updateAddress: async (token, addressId, addressData) => {
        try {
            const response = await axios.put(
                `${API_URL}/${addressId}`,
                addressData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            return response.data.address;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error updating address"
            );
        }
    },

    // Delete an address
    deleteAddress: async (token, addressId) => {
        try {
            const response = await axios.delete(`${API_URL}/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.message || "Error deleting address"
            );
        }
    },

    // Set default address
    setDefaultAddress: async (token, addressId) => {
        try {
            const response = await axios.put(
                `${API_URL}/${addressId}/default`,
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
                error.response?.data?.message || "Error setting default address"
            );
        }
    },
};
