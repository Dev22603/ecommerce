import React from "react";

const ProductDetailsModal = ({ product, quantity, setQuantity, handleAddToCart, closeModal }) => {
  // Increase quantity function
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrease quantity function
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500"
        >
          <span className="text-2xl">&times;</span>
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold">{product.name}</h2>

          {/* Carousel of product images */}
          <div className="carousel mb-4">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                className="w-full h-64 object-cover mb-2"
              />
            ))}
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-200 p-2 rounded-md"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-200 p-2 rounded-md"
            >
              +
            </button>
          </div>

          <p className="text-lg font-semibold text-blue-600 mb-4">
            Price: ${product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded-md w-full"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
