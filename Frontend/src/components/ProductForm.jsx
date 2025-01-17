import React, { useState } from "react";

const ProductForm = ({ initialProduct, onSubmit, onCancel }) => {
    const [productName, setProductName] = useState(
        initialProduct?.product_name || ""
    );
    const [wsCode, setWsCode] = useState(initialProduct?.ws_code || "");
    const [salesPrice, setSalesPrice] = useState(
        initialProduct?.sales_price || ""
    );
    const [mrp, setMrp] = useState(initialProduct?.mrp || "");
    const [packageSize, setPackageSize] = useState(
        initialProduct?.package_size || ""
    );
    const [tags, setTags] = useState(initialProduct?.tags?.join(", ") || "");
    const [categoryId, setCategoryId] = useState(
        initialProduct?.category_id || ""
    );
    const [stock, setStock] = useState(initialProduct?.stock || 0);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

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

        // Generate previews
        const previews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate inputs
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

        // Create product data object
        const productData = {
            product_name: productName,
            ws_code: parseInt(wsCode),
            sales_price: parseInt(salesPrice),
            mrp: parseInt(mrp),
            package_size: parseInt(packageSize),
            tags: tags.split(",").map((tag) => tag.trim()),
            category_id: parseInt(categoryId),
            stock: parseInt(stock),
            images,
        };

        onSubmit(productData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg space-y-6"
        >
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

            {/* File Upload Section */}
            <div>
                <label htmlFor="images" className="block font-medium">
                    Upload Images
                </label>
                <input
                    id="images"
                    type="file"
                    multiple
                    accept=".png, .jpeg, .webp"
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
