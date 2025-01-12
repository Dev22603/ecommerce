import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";  // Assuming you're using a Cart context

// ProductCard component
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext); // Access CartContext to add items to cart

  // Function to handle adding product to the cart
  const handleAddToCart = () => {
    addToCart(product);  // Add product to cart
  };

  return (
    <div className="product-card">
      <img
        src={product.image || 'default-image-path.jpg'}
        alt={product.name}
        className="product-image"
      />
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="product-price">${product.price}</span>
          {product.rating && (
            <span className="product-rating">
              {`⭐ ${product.rating} (${product.reviewCount} reviews)`}
            </span>
          )}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
