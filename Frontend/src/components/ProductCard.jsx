import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlinePhotograph,
} from "react-icons/hi";

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    loading: isLoading,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const imageUrl = product.images?.[0]
    ? `http://localhost:5000/api${product.images[0]}`
    : null;

  // Get cart item and quantity from context
  const cartItem = cartItems.find(
    (item) => item.product_id === product.id || item.id === product.id
  );
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    if (!user) {
      toast.warning("Please log in to add items to the cart.", {
        autoClose: 1500,
        onClose: () => navigate("/login"),
      });
      return;
    }
    if (user.role === "admin") {
      return toast.error("Admin accounts cannot add items to the cart.", {
        autoClose: 1200,
      });
    }

    if (cartItem) {
      await updateItemQuantity(product.id, quantity + 1);
    } else {
      await addItemToCart(product);
      toast.success("Added to cart!", { autoClose: 1000 });
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (!user?.token) return;
    if (newQuantity <= 0) return handleRemoveFromCart();
    await updateItemQuantity(product.id, newQuantity);
  };

  const handleRemoveFromCart = async () => {
    if (!user?.token) return;
    await removeItemFromCart(product.id);
    toast.info("Removed from cart", { autoClose: 1000 });
  };

  const discount = product.mrp
    ? Math.round(((product.mrp - product.sales_price) / product.mrp) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`group relative bg-nexus-800/40 rounded-2xl overflow-hidden border border-nexus-600/30
        transition-all duration-500 ease-out
        ${isHovered ? "border-accent/40 shadow-glow bg-nexus-700/40 -translate-y-2" : ""}
        ${isOutOfStock ? "opacity-60" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-nexus-700/30">
        {/* Discount Badge */}
        {discount > 0 && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="badge badge-accent">-{discount}%</span>
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="badge badge-error">Out of Stock</span>
          </div>
        )}

        {/* WS Code Badge */}
        {product.ws_code && (
          <div className="absolute top-3 right-3 z-10">
            <span className="badge badge-neutral text-xs">
              #{product.ws_code}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="relative w-full h-full">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-nexus-600/50 animate-pulse" />
            </div>
          )}

          {imageError || !imageUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-nexus-400">
              <HiOutlinePhotograph className="w-16 h-16 mb-2" />
              <span className="text-xs">No image</span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={product.product_name}
              className={`w-full h-full object-cover transition-all duration-700 ease-out
                ${imageLoaded ? "opacity-100" : "opacity-0"}
                ${isHovered ? "scale-110" : "scale-100"}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
        </div>

      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category/Tags */}
        {product.tags && (
          <p className="text-xs text-nexus-300 uppercase tracking-wider mb-1 truncate">
            {product.tags}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-heading font-semibold text-nexus-50 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
          {product.product_name}
        </h3>

        {/* Package Size */}
        {product.package_size && (
          <p className="text-xs text-nexus-300 mb-3">{product.package_size}</p>
        )}

        {/* Price Section */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold text-xl text-accent">
                ₹{product.sales_price?.toLocaleString()}
              </span>
              {product.mrp && product.mrp > product.sales_price && (
                <span className="text-sm text-nexus-400 line-through">
                  ₹{product.mrp?.toLocaleString()}
                </span>
              )}
            </div>
            {product.mrp && product.mrp > product.sales_price && (
              <p className="text-xs text-status-success mt-0.5">
                Save ₹{(product.mrp - product.sales_price).toLocaleString()}
              </p>
            )}
          </div>

          {/* Stock Indicator */}
          {product.stock > 0 && product.stock <= 10 && (
            <span className="text-xs text-status-warning">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="mt-4">
          {isOutOfStock ? (
            <button disabled className="btn-secondary w-full opacity-50">
              Out of Stock
            </button>
          ) : cartItem ? (
            <div className="flex items-center justify-between bg-nexus-700/50 rounded-xl p-1">
              <button
                onClick={handleRemoveFromCart}
                disabled={isLoading}
                className="p-2 text-status-error hover:bg-status-error/20 rounded-lg transition-colors"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  disabled={isLoading}
                  className="p-2 text-nexus-100 hover:bg-nexus-600 rounded-lg transition-colors"
                >
                  <HiOutlineMinus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-nexus-50">
                  {quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  disabled={isLoading}
                  className="p-2 text-nexus-100 hover:bg-nexus-600 rounded-lg transition-colors"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="btn-primary w-full"
            >
              <HiOutlineShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>


      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-nexus-900/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

/*
 * PERFORMANCE OPTIMIZATION: React.memo prevents unnecessary re-renders of the product grid
 * when unrelated state (like the searchQuery in Home.jsx) changes rapidly.
 */
export default React.memo(ProductCard);
