import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";

const ProductManager = ({ products, refreshData }) => {
    const [newProduct, setNewProduct] = useState({
        product_name: "",
        ws_code: "",
        sales_price: "",
        mrp: "",
        package_size: "",
        images: [],
        tags: "",
        category_id: "",
    });
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await adminService.getCategories(); // Assuming you have a method to fetch categories
                console.log(response);

                setCategories(response);
            } catch (err) {
                setError("Failed to fetch categories.");
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files);
        if (files.length > 10) {
            setError("You can only select up to 10 images.");
            return;
        }

        // Validate file extensions
        const validExtensions = ["image/png", "image/jpeg", "image/webp"];
        const invalidFiles = files.filter(
            (file) => !validExtensions.includes(file.type)
        );

        if (invalidFiles.length > 0) {
            setError("Only .png, .jpeg, and .webp images are allowed.");
            return;
        }

        setNewProduct((prev) => ({ ...prev, images: files }));
        setError(null);
    };

    const handleAddProduct = async () => {
        const {
            product_name,
            ws_code,
            sales_price,
            mrp,
            package_size,
            images,
            tags,
            category_id,
        } = newProduct;
        if (
            !product_name ||
            !ws_code ||
            !sales_price ||
            !mrp ||
            !package_size ||
            !category_id ||
            images.length === 0
        ) {
            setError(
                "All fields must be filled, and at least one image must be selected."
            );
            return;
        }

        try {
            const formData = new FormData();
            formData.append("product_name", product_name);
            formData.append("ws_code", ws_code);
            formData.append("sales_price", sales_price);
            formData.append("mrp", mrp);
            formData.append("package_size", package_size);
            formData.append("tags", tags);
            formData.append("category_id", category_id);

            images.forEach((image) => {
                formData.append("images", image);
            });

            await adminService.addProduct(formData);
            setNewProduct({
                product_name: "",
                ws_code: "",
                sales_price: "",
                mrp: "",
                package_size: "",
                images: [],
                tags: "",
                category_id: "",
            });
            refreshData(); // Refresh product list
        } catch (err) {
            setError("Failed to add product.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await adminService.deleteProduct(productId);
            refreshData(); // Refresh product list after deletion
        } catch (err) {
            setError("Failed to delete product.");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Product Management</h2>
            <div className="mb-4">
                <input
                    type="text"
                    name="product_name"
                    value={newProduct.product_name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <input
                    type="number"
                    name="ws_code"
                    value={newProduct.ws_code}
                    onChange={handleChange}
                    placeholder="WS Code"
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <input
                    type="number"
                    name="sales_price"
                    value={newProduct.sales_price}
                    onChange={handleChange}
                    placeholder="Sales Price"
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <input
                    type="number"
                    name="mrp"
                    value={newProduct.mrp}
                    onChange={handleChange}
                    placeholder="MRP"
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <input
                    type="number"
                    name="package_size"
                    value={newProduct.package_size}
                    onChange={handleChange}
                    placeholder="Package Size"
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <input
                    type="file"
                    name="images"
                    multiple
                    accept=".png, .jpeg, .webp"
                    onChange={handleImageChange}
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <input
                    type="text"
                    name="tags"
                    value={newProduct.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma separated)"
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                />
                <select
                    name="category_id"
                    value={newProduct.category_id}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg mr-2"
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleAddProduct}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg mt-4"
                >
                    Add Product
                </button>
            </div>
            {error && <div className="text-red-600">{error}</div>}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <li
                        key={product.id}
                        className="p-4 border border-gray-200 rounded-lg shadow-md flex flex-col items-start"
                    >
                        {/* Product Image */}
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={`${product.images[0]}`} // First image from the array
                                    alt={product.product_name}
                                    className="object-cover h-full w-full"
                                />
                            ) : (
                                <span className="text-gray-400">
                                    No Image Available
                                </span>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="mt-4 w-full">
                            <h3 className="text-lg font-bold text-gray-800">
                                {product.product_name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                                <strong>WS Code:</strong> {product.ws_code}
                            </p>
                            <p className="text-gray-600 text-sm">
                                <strong>Sales Price:</strong> ₹
                                {product.sales_price}
                            </p>
                            <p className="text-gray-600 text-sm">
                                <strong>MRP:</strong> ₹{product.mrp}
                            </p>
                            <p className="text-gray-600 text-sm">
                                <strong>Package Size:</strong>{" "}
                                {product.package_size}
                            </p>
                            <p className="text-gray-600 text-sm">
                                <strong>Tags:</strong>{" "}
                                {product.tags && product.tags.length > 0
                                    ? product.tags.join(", ")
                                    : "None"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Category:</strong>
                                {
                                    // Look up the category name based on the category_id of the product
                                    categories.find(
                                        (category) =>
                                            category.id === product.category_id
                                    )?.category_name || "N/A"
                                }
                            </p>
                        </div>

                        {/* Delete Button */}
                        <div className="mt-4 w-full flex justify-end">
                            <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="py-2 px-4 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManager;
