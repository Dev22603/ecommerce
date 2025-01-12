// src/pages/Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const history = useHistory();

  useEffect(() => {
    // Calculate total amount whenever cartItems change
    const calculateTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(calculateTotal);
  }, [cartItems]);

  const handleClearCart = () => {
    clearCart();
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some products before proceeding.");
      return;
    }
    // Redirect to the order summary page
    history.push("/order-summary");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-xl text-gray-600">Your cart is empty.</div>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-700">Total: ₹{total}</div>
            <div className="space-x-4">
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
              >
                Clear Cart
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 text-center">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
