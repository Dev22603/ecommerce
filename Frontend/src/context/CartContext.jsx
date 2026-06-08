import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { cartService } from "../services/cartService";
import { AuthContext } from "./AuthContext";

// Create a context for the cart
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Access user token from AuthContext
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Centralized error handler
    const handleError = (errorMessage) => {
        setError(errorMessage || "An error occurred.");
        setLoading(false);
    };

    // Fetch the initial cart items
    const fetchCartItems = async () => {
        if (!user?.token) return; // Skip fetching if the user is not authenticated
        setLoading(true);
        setError(null);

        try {
            const cart = await cartService.getCart(1, 100, user.token); // Paginated fetch
            console.log(cart);

            setCartItems(cart.items || []);
        } catch (error) {
            handleError(error.message || "Failed to fetch cart items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems(); // Fetch cart items on user login/logout or token change
    }, [user]); // Runs when `user` (or the user’s token) changes

    // Add item to the cart
    const addItemToCart = async (product) => {
        if (!user?.token) return setError("User is not authenticated.");
        setLoading(true);

        try {
            await cartService.addItemToCart(product.id, user.token);
            setCartItems((prevItems) => {
                const existingItem = prevItems.find(
                    (item) => item.product_id === product.id || item.id === product.id
                );
                if (existingItem) {
                    return prevItems.map((item) =>
                        (item.product_id === product.id || item.id === product.id)
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, product_id: product.id, quantity: 1 }];
                }
            });
        } catch (error) {
            handleError(error.message || "Failed to add item to cart.");
        } finally {
            setLoading(false);
        }
    };

    // Update item quantity in the cart
    const updateItemQuantity = async (productId, quantity) => {
        if (!user?.token) return setError("User is not authenticated.");
        if (quantity <= 0) {
            removeItemFromCart(productId);
            return;
        }
        setLoading(true);

        try {
            await cartService.updateCart(productId, quantity, user.token);
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    (item.product_id === productId || item.id === productId)
                        ? { ...item, quantity }
                        : item
                )
            );
        } catch (error) {
            handleError(error.message || "Failed to update item quantity.");
        } finally {
            setLoading(false);
        }
    };

    // Remove item from the cart
    const removeItemFromCart = async (productId) => {
        if (!user?.token) return setError("User is not authenticated.");
        setLoading(true);

        try {
            await cartService.removeItemFromCart(productId, user.token);
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.product_id !== productId && item.id !== productId)
            );
        } catch (error) {
            handleError(error.message || "Failed to remove item from cart.");
        } finally {
            setLoading(false);
        }
    };

    // Clear the cart
    const clearCart = async () => {
        if (!user?.token) return setError("User is not authenticated.");
        setLoading(true);

        try {
            await cartService.clearCart(user.token);
            setCartItems([]);
        } catch (error) {
            handleError(error.message || "Failed to clear cart.");
        } finally {
            setLoading(false);
        }
    };

    // ⚡ Bolt: Memoize derived cart state to avoid recalculating on every render
    // Impact: Prevents O(N) recalculation of total price and quantity on every render of components consuming the CartContext
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce(
            (total, item) => total + (item.sales_price || 0) * (item.quantity || 0),
            0
        );
    }, [cartItems]);

    // Get a specific cart item's quantity
    const getCartItemQuantity = (productId) => {
        const item = cartItems.find(
            (item) => item.product_id === productId || item.id === productId
        );
        return item ? item.quantity : 0;
    };

    // Get the total quantity of items in the cart
    const getTotalQuantity = () => totalQuantity;

    // Get the total price of items in the cart
    const getTotalPrice = () => totalPrice;

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItemToCart,
                updateItemQuantity,
                removeItemFromCart,
                clearCart,
                refreshCart: fetchCartItems,
                getCartItemQuantity,
                getTotalQuantity,
                getTotalPrice,
                totalQuantity,
                totalPrice,
                loading,
                error,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
