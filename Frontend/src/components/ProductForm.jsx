import React, { useState, useEffect } from "react";
import {
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";

const ProductForm = ({ initialProduct, onSubmit, onCancel, isOpen }) => {
  const [productName, setProductName] = useState("");
  const [wsCode, setWsCode] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [packageSize, setPackageSize] = useState("");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Populate the form with initialProduct data
  useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.product_name || "");
      setWsCode(initialProduct.ws_code || "");
      setSalesPrice(initialProduct.sales_price || "");
      setMrp(initialProduct.mrp || "");
      setPackageSize(initialProduct.package_size || "");
      setTags(Array.isArray(initialProduct.tags) ? initialProduct.tags.join(", ") : initialProduct.tags || "");
      setCategoryId(initialProduct.category_id || "");
      setStock(initialProduct.stock || 0);
      setExistingImages(initialProduct.images || []);
    } else {
      // Reset form for new product
      setProductName("");
      setWsCode("");
      setSalesPrice("");
      setMrp("");
      setPackageSize("");
      setTags("");
      setCategoryId("");
      setStock(0);
      setImages([]);
      setPreviewImages([]);
      setExistingImages([]);
    }
  }, [initialProduct]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/png", "image/jpeg", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert("Only .png, .jpeg, and .webp files are allowed!");
      return;
    }

    setImages(validFiles);
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages(existingImages.filter((image) => image !== url));
  };

  const handleRemoveNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !productName ||
      !wsCode ||
      !salesPrice ||
      !mrp ||
      !packageSize ||
      !categoryId
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("ws_code", wsCode);
    formData.append("sales_price", salesPrice);
    formData.append("mrp", mrp);
    formData.append("package_size", packageSize);
    formData.append("tags", tags);
    formData.append("category_id", categoryId);
    formData.append("stock", stock);

    images.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-nexus-900/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-nexus-800 border border-nexus-600 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-nexus-600">
          <h2 className="font-heading text-xl font-bold text-nexus-50">
            {initialProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-nexus-400 hover:text-nexus-100 hover:bg-nexus-700 rounded-lg transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="input"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="input-label">WS Code *</label>
                <input
                  type="number"
                  value={wsCode}
                  onChange={(e) => setWsCode(e.target.value)}
                  className="input"
                  placeholder="e.g., 12345"
                  required
                />
              </div>

              <div>
                <label className="input-label">Category ID *</label>
                <input
                  type="number"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input"
                  placeholder="e.g., 1"
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-sm font-medium text-nexus-200 mb-3">Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">Sales Price (₹) *</label>
                  <input
                    type="number"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(e.target.value)}
                    className="input"
                    placeholder="e.g., 999"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">MRP (₹) *</label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="input"
                    placeholder="e.g., 1299"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="input"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Package Size *</label>
                <input
                  type="text"
                  value={packageSize}
                  onChange={(e) => setPackageSize(e.target.value)}
                  className="input"
                  placeholder="e.g., Pack of 12, 1 Dozen, Per Piece"
                  required
                />
              </div>

              <div>
                <label className="input-label">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input"
                  placeholder="e.g., birthday, party, decoration"
                />
                <p className="input-hint">Comma-separated tags</p>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-sm font-medium text-nexus-200 mb-3">Images</h3>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-nexus-400 mb-2">Current Images</p>
                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative group w-20 h-20 rounded-lg overflow-hidden bg-nexus-700"
                      >
                        <img
                          src={`http://localhost:5000/api${url}`}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(url)}
                          className="absolute inset-0 bg-nexus-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiOutlineTrash className="w-5 h-5 text-status-error" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-nexus-500 rounded-xl cursor-pointer hover:border-accent transition-colors bg-nexus-700/20">
                  <HiOutlinePhotograph className="w-8 h-8 text-nexus-400 mb-2" />
                  <span className="text-sm text-nexus-300">
                    Click to upload images
                  </span>
                  <span className="text-xs text-nexus-400 mt-1">
                    PNG, JPEG, or WebP
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".png, .jpeg, .webp, .jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* New Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-nexus-400 mb-2">New Images</p>
                    <div className="flex flex-wrap gap-3">
                      {previewImages.map((url, index) => (
                        <div
                          key={index}
                          className="relative group w-20 h-20 rounded-lg overflow-hidden bg-nexus-700"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute inset-0 bg-nexus-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HiOutlineTrash className="w-5 h-5 text-status-error" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-nexus-600 bg-nexus-850">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary relative"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-nexus-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <HiOutlinePlus className="w-4 h-4" />
                  {initialProduct ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
