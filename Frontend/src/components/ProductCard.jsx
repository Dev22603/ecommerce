import React, { useState, useEffect, useContext } from "react";
import {
    addItemToCart,
    updateCart,
    removeItemFromCart,
    checkCartItemQuantity,
} from "../services/cartService";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ product }) => {
    const [cartItem, setCartItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const navigate = useNavigate();

    // Fetch cart state for the product on component mount
    useEffect(() => {
        const fetchCartItem = async () => {
            if (!token) return;
            try {
                setIsLoading(true);

                const cartData = await checkCartItemQuantity(product.id, token);
                if (cartData?.quantity) {
                    setCartItem(cartData); // Set cart item state
                    setQuantity(cartData.quantity); // Set quantity
                }
            } catch (error) {
                console.error("Error fetching cart item:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCartItem();
    }, [product.id, token]);

    const handleAddToCart = async () => {
        if (!user) {
            toast.warning("Please log in to add items to the cart.", {
                autoClose: 1500, // Toast duration: 1.5 seconds
                onClose: () => navigate("/login"), // Navigate to login after the toast closes
            });
            return;
        }
        if (user.role === "admin") {
            return toast.error(
                "Admin accounts cannot add items to the cart. Please log in as a customer."
            );
        }

        try {
            setIsLoading(true);
            if (cartItem) {
                // If item exists in the cart, increase quantity
                await updateCart(product.id, quantity + 1, token);
                setQuantity((prev) => prev + 1);
            } else {
                // Add new item to the cart
                const newCartItem = await addItemToCart(product.id, token);
                setCartItem(newCartItem);
                setQuantity(newCartItem.quantity);
            }
        } catch (error) {
            console.error("Failed to add/update item in cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateQuantity = async (newQuantity) => {
        if (!token) {
            console.error("User is not authenticated.");
            return;
        }

        if (newQuantity <= 0) return handleRemoveFromCart();
        try {
            setIsLoading(true);
            await updateCart(product.id, newQuantity, token);
            setQuantity(newQuantity);
        } catch (error) {
            console.error("Failed to update cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFromCart = async () => {
        if (!token) {
            console.error("User is not authenticated.");
            return;
        }

        try {
            setIsLoading(true);
            await removeItemFromCart(product.id, token);
            setCartItem(null); // Clear cart item state
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border rounded-lg shadow-md p-4 flex flex-col items-center text-center">
            <img
                src={product.images[0]}
                alt={product.product_name}
                className="h-40 w-40 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold">{product.product_name}</h2>
            <p className="text-gray-600">₹{product.sales_price}</p>
            {cartItem ? (
                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                        -
                    </button>
                    <span>{quantity}</span>
                    <button
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        disabled={isLoading}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                        +
                    </button>
                    <button
                        onClick={handleRemoveFromCart}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-300 text-red-600 rounded"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add to Cart
                </button>
            )}
        </div>
    );
};

export default ProductCard;
