// // Frontend\src\context\CartContext.jsx
// import React, { createContext, useState, useContext } from "react";

// // Create a context for the cart
// export const CartContext = createContext();

// // Create a provider component
// export const CartProvider = ({ children }) => {
//   // State for managing the cart items
//   const [cartItems, setCartItems] = useState([]);

//   // Add item to the cart
//   const addItemToCart = (item) => {
//     setCartItems((prevItems) => [...prevItems, item]);
//   };

//   // Remove item from the cart
//   const removeItemFromCart = (itemId) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
//   };

//   // Clear the cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // Calculate total price of items in the cart
//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addItemToCart,
//         removeItemFromCart,
//         clearCart,
//         getTotalPrice,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use cart context
// export const useCart = () => {
//   return useContext(CartContext);
// };


import React, { createContext, useState, useContext, useEffect } from "react";
import {
  addItemToCart as addItemToCartService,
  updateCart as updateCartService,
  removeItemFromCart as removeItemFromCartService,
  checkCartItemQuantity,
} from "../services/cartService";

// Create a context for the cart
export const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch the initial cart items (could be added later if needed)
  const fetchCartItems = async () => {
    try {
      // Fetch current cart items from backend (if applicable)
      const cart = []; // Replace with an API call if needed
      setCartItems(cart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Add item to the cart
  const addItemToCart = async (product) => {
    try {
      await addItemToCartService(product.id);
      setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Update item quantity in the cart
  const updateItemQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        removeItemFromCart(productId);
        return;
      }
      await updateCartService(productId, quantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Remove item from the cart
  const removeItemFromCart = async (productId) => {
    try {
      await removeItemFromCartService(productId);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Check if a product is in the cart and get its quantity
  const getCartItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Calculate total price of items in the cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.sales_price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart,
        getCartItemQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};
