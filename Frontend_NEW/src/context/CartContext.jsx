import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to fetch the cart from the server
    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/api/cart");
            setCartItems(response.data.cartItems || []);
            setCartTotal(response.data.grandTotal || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add an item to the cart
    const addToCart = async (productId) => {
        try {
            const response = await axios.post("/api/cart/add", {
                product_id: productId,
            });
            fetchCart(); // Update the cart after adding
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Remove an item from the cart
    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`/api/cart/remove/${productId}`);
            fetchCart(); // Update the cart after removing
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Increment the quantity of an item
    const incrementQuantity = async (productId) => {
        try {
            await axios.patch("/api/cart/increment", { product_id: productId });
            fetchCart(); // Update the cart after incrementing
        } catch (error) {
            console.error("Error incrementing quantity:", error);
        }
    };

    // Decrement the quantity of an item
    const decrementQuantity = async (productId) => {
        try {
            await axios.patch("/api/cart/decrement", { product_id: productId });
            fetchCart(); // Update the cart after decrementing
        } catch (error) {
            console.error("Error decrementing quantity:", error);
        }
    };

    // Clear the cart
    const clearCart = async () => {
        try {
            await axios.delete("/api/cart/clear");
            setCartItems([]); // Reset cart items
            setCartTotal(0); // Reset total
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    useEffect(() => {
        fetchCart(); // Fetch the cart when the component mounts
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartTotal,
                isLoading,
                addToCart,
                removeFromCart,
                incrementQuantity,
                decrementQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
