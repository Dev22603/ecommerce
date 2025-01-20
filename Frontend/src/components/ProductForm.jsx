// // Frontend\src\components\ProductForm.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
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

    // Populate the form with initialProduct data
    useEffect(() => {
        if (initialProduct) {
            setProductName(initialProduct.product_name || "");
            setWsCode(initialProduct.ws_code || "");
            setSalesPrice(initialProduct.sales_price || "");
            setMrp(initialProduct.mrp || "");
            setPackageSize(initialProduct.package_size || "");
            setTags((initialProduct.tags || []).join(", "));
            setCategoryId(initialProduct.category_id || "");
            setStock(initialProduct.stock || 0);
            setExistingImages(initialProduct.images || []);
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

        // Generate previews for the new images
        const previews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleRemoveExistingImage = (url) => {
        setExistingImages(existingImages.filter((image) => image !== url));
    };

    const handleSubmit = (e) => {
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

        const formData = new FormData();
        formData.append("product_name", productName);
        formData.append("ws_code", wsCode);
        formData.append("sales_price", salesPrice);
        formData.append("mrp", mrp);
        formData.append("package_size", packageSize);
        formData.append("tags", tags);
        formData.append("category_id", categoryId);
        formData.append("stock", stock);

        // Append new images
        images.forEach((image) => {
            formData.append("images", image);
        });

        // Append existing images
        console.log(existingImages);

        formData.append("existingImages", JSON.stringify(existingImages));

        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg space-y-6"
            encType="multipart/form-data"
        >
            {/* Form Fields */}
            <h2 className="text-xl font-semibold text-center">Product Form</h2>
            <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="productName"
                            className="block font-medium"
                        >
                            Product Name
                        </label>
                        <input
                            id="productName"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="wsCode" className="block font-medium">
                            WS Code
                        </label>
                        <input
                            id="wsCode"
                            type="number"
                            value={wsCode}
                            onChange={(e) => setWsCode(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="salesPrice"
                            className="block font-medium"
                        >
                            Sales Price (₹)
                        </label>
                        <input
                            id="salesPrice"
                            type="number"
                            value={salesPrice}
                            onChange={(e) => setSalesPrice(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mrp" className="block font-medium">
                            MRP (₹)
                        </label>
                        <input
                            id="mrp"
                            type="number"
                            value={mrp}
                            onChange={(e) => setMrp(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="packageSize"
                            className="block font-medium"
                        >
                            Package Size
                        </label>
                        <input
                            id="packageSize"
                            type="number"
                            value={packageSize}
                            onChange={(e) => setPackageSize(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tags" className="block font-medium">
                            Tags (comma-separated)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="categoryId"
                            className="block font-medium"
                        >
                            Category ID
                        </label>
                        <input
                            id="categoryId"
                            type="number"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block font-medium">
                            Stock
                        </label>
                        <input
                            id="stock"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Existing Image Previews */}
            {existingImages.length > 0 && (
                <div>
                    <h3 className="font-medium">Existing Images</h3>
                    <div className="flex flex-wrap gap-4">
                        {existingImages.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`Existing ${index + 1}`}
                                    className="w-20 h-20 object-cover border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveExistingImage(url)
                                    }
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Image Upload */}
            <div>
                <label htmlFor="images" className="block font-medium">
                    Upload New Images
                </label>
                <input
                    id="images"
                    type="file"
                    multiple
                    accept=".png, .jpeg, .webp, .jpg"
                    onChange={handleFileChange}
                    className="w-full border rounded px-3 py-2"
                />
                <div className="mt-4 flex flex-wrap gap-4">
                    {previewImages.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover border rounded"
                        />
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
