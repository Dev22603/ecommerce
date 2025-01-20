// src/components/CartItem.jsx
import React from "react";

const CartItem = ({ item, removeFromCart }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <img
          src={`http://localhost:5000/api${item.images[0]}`} // Assuming each product has an image
          alt={item.name}
          className="w-20 h-20 object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-600 hover:text-red-800 font-semibold"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
