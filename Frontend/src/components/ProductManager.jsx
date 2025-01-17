import React, { useState } from "react";
import { adminService } from "../services/adminService";

const ProductManager = ({ products, refreshData }) => {
  const [newProduct, setNewProduct] = useState("");
  const [error, setError] = useState(null);

  const handleAddProduct = async () => {
    if (!newProduct) {
      setError("Product name cannot be empty.");
      return;
    }
    try {
      await adminService.addProduct({ name: newProduct });
      setNewProduct("");
      refreshData(); // Refresh product list
    } catch {
      setError("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await adminService.deleteProduct(productId);
      refreshData(); // Refresh product list
    } catch {
      setError("Failed to delete product.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product Management</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          placeholder="New Product Name"
          className="p-2 border border-gray-300 rounded-lg mr-2"
        />
        <button
          onClick={handleAddProduct}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg"
        >
          Add Product
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex justify-between items-center p-2 border border-gray-200 rounded-lg"
          >
            <span>{product.name}</span>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="py-1 px-3 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
