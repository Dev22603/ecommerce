import React, { useState } from "react";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePhotograph,
  HiOutlineEye,
} from "react-icons/hi";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  const closeModal = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedProduct?.images) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % selectedProduct.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct?.images) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedProduct.images.length) %
          selectedProduct.images.length
      );
    }
  };

  const handleDelete = async (e, productId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(productId);
      try {
        await onDelete(productId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-nexus-800 rounded-xl mb-4">
          <HiOutlinePhotograph className="w-8 h-8 text-nexus-400" />
        </div>
        <p className="text-nexus-300">No products found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>WS Code</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-nexus-700/50 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img
                          src={`http://localhost:5000/api${product.images[0]}`}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiOutlinePhotograph className="w-5 h-5 text-nexus-500" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-nexus-50 truncate max-w-[200px]">
                        {product.product_name}
                      </p>
                      <p className="text-xs text-nexus-400">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral">#{product.ws_code}</span>
                </td>
                <td>
                  <div>
                    <p className="font-semibold text-accent">
                      ₹{Number(product.sales_price).toLocaleString()}
                    </p>
                    {product.mrp && product.mrp > product.sales_price && (
                      <p className="text-xs text-nexus-400 line-through">
                        ₹{Number(product.mrp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      product.stock === 0
                        ? "badge-error"
                        : product.stock <= 10
                          ? "badge-warning"
                          : "badge-success"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : `${product.stock} in stock`}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="p-2 text-nexus-300 hover:text-accent hover:bg-nexus-700 rounded-lg transition-colors"
                      title="View"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(product);
                      }}
                      className="p-2 text-nexus-300 hover:text-status-info hover:bg-status-info/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <HiOutlinePencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, product.id)}
                      disabled={deletingId === product.id}
                      className="p-2 text-nexus-300 hover:text-status-error hover:bg-status-error/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === product.id ? (
                        <div className="w-4 h-4 border-2 border-status-error border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiOutlineTrash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="card p-4 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-nexus-700/50 rounded-lg overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img
                    src={`http://localhost:5000/api${product.images[0]}`}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <HiOutlinePhotograph className="w-6 h-6 text-nexus-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-nexus-50 truncate">
                  {product.product_name}
                </p>
                <p className="text-xs text-nexus-400 mb-2">
                  #{product.ws_code} | ID: {product.id}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-accent">
                    ₹{Number(product.sales_price).toLocaleString()}
                  </p>
                  <span
                    className={`badge text-xs ${
                      product.stock === 0
                        ? "badge-error"
                        : product.stock <= 10
                          ? "badge-warning"
                          : "badge-success"
                    }`}
                  >
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-nexus-600/50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="btn-secondary btn-sm flex-1"
              >
                <HiOutlinePencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={(e) => handleDelete(e, product.id)}
                disabled={deletingId === product.id}
                className="btn-danger btn-sm flex-1"
              >
                {deletingId === product.id ? (
                  <div className="w-4 h-4 border-2 border-status-error border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <HiOutlineTrash className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-nexus-900/80 backdrop-blur-sm" />

          <div
            className="relative bg-nexus-800 border border-nexus-600 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-nexus-900/50 backdrop-blur-sm text-nexus-200 hover:text-nexus-50 rounded-lg transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            {/* Image Carousel */}
            <div className="relative aspect-video bg-nexus-700/30">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <>
                  <img
                    src={`http://localhost:5000/api${selectedProduct.images[currentImageIndex]}`}
                    alt={`Product ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />

                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-nexus-900/70 backdrop-blur-sm text-nexus-100 hover:text-accent rounded-full transition-colors"
                      >
                        <HiOutlineChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-nexus-900/70 backdrop-blur-sm text-nexus-100 hover:text-accent rounded-full transition-colors"
                      >
                        <HiOutlineChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedProduct.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-accent"
                                : "bg-nexus-500 hover:bg-nexus-400"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-nexus-400">
                  <HiOutlinePhotograph className="w-16 h-16 mb-2" />
                  <span>No images available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-nexus-50 mb-1">
                    {selectedProduct.product_name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-neutral">
                      #{selectedProduct.ws_code}
                    </span>
                    <span className="text-xs text-nexus-400">
                      ID: {selectedProduct.id}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-3xl font-bold text-accent">
                    ₹{Number(selectedProduct.sales_price).toLocaleString()}
                  </p>
                  {selectedProduct.mrp &&
                    selectedProduct.mrp > selectedProduct.sales_price && (
                      <p className="text-sm text-nexus-400 line-through">
                        MRP: ₹{Number(selectedProduct.mrp).toLocaleString()}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-nexus-700/20 rounded-xl">
                <div>
                  <p className="text-xs text-nexus-400">Stock</p>
                  <p
                    className={`font-semibold ${
                      selectedProduct.stock === 0
                        ? "text-status-error"
                        : selectedProduct.stock <= 10
                          ? "text-status-warning"
                          : "text-nexus-50"
                    }`}
                  >
                    {selectedProduct.stock}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-nexus-400">Package Size</p>
                  <p className="font-semibold text-nexus-50">
                    {selectedProduct.package_size || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-nexus-400">Category</p>
                  <p className="font-semibold text-nexus-50">
                    {selectedProduct.category_id || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-nexus-400">Tags</p>
                  <p className="font-semibold text-nexus-50 truncate">
                    {selectedProduct.tags || "N/A"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    closeModal();
                    onEdit(selectedProduct);
                  }}
                  className="btn-primary flex-1"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                  Edit Product
                </button>
                <button onClick={closeModal} className="btn-secondary flex-1">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
