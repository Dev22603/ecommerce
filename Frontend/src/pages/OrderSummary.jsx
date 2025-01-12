// src/pages/OrderSummary.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const OrderSummary = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const history = useHistory();

  useEffect(() => {
    // Calculate total amount whenever cartItems change
    const calculateTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(calculateTotal);
  }, [cartItems]);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add some products before proceeding.");
      return;
    }
    if (!address) {
      alert("Please enter a delivery address.");
      return;
    }
    // Simulate placing the order
    alert(`Order placed successfully!\nTotal: ₹${total}\nPayment Method: ${paymentMethod}\nDelivery Address: ${address}`);
    clearCart();
    history.push("/"); // Redirect to home page after placing the order
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Order Summary</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-xl text-gray-600">Your cart is empty.</div>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image} // Assuming each product has an image
                    alt={item.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="address" className="block text-lg font-medium text-gray-700">Delivery Address</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="4"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your delivery address"
              ></textarea>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-lg font-medium text-gray-700">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Credit Card">Credit/Debit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-xl font-semibold text-gray-700">Total: ₹{total}</div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Place Order
            </button>
            <Link
              to="/cart"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go Back to Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
