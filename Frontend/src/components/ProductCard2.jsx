import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const { user } = React.useContext(AuthContext);
    const {
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        getCartItemQuantity,
    } = useCart();
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    // Sync quantity with cart context
    useEffect(() => {
        const cartQuantity = getCartItemQuantity(product.id);
        if (cartQuantity) {
            setQuantity(cartQuantity);
        }
    }, [product.id, getCartItemQuantity]);

    const handleAddToCart = () => {
        if (!user) {
            toast.warning("Please log in to add items to the cart.", {
                autoClose: 1500,
                onClose: () => navigate("/login"),
            });
            return;
        }
        if (user.role === "admin") {
            return toast.error(
                "Admin accounts cannot add items to the cart. Please log in as a customer."
            );
        }
        addItemToCart(product);
    };

    const handleUpdateQuantity = (newQuantity) => {
        if (newQuantity <= 0) {
            removeItemFromCart(product.id);
        } else {
            updateItemQuantity(product.id, newQuantity);
        }
        setQuantity(newQuantity);
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
            {quantity > 0 ? (
                <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                        -
                    </button>
                    <span>{quantity}</span>
                    <button
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                        +
                    </button>
                    <button
                        onClick={() => removeItemFromCart(product.id)}
                        className="px-4 py-2 bg-gray-300 text-red-600 rounded"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add to Cart
                </button>
            )}
        </div>
    );
};

export default ProductCard;