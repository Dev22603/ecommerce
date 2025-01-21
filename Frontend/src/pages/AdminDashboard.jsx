// Frontend\src\pages\AdminDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { AuthContext } from "../context/AuthContext";
import { productService } from "../services/productService";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const { user } = useContext(AuthContext);
    const token = user?.token;
    const itemsPerPage = 10; // Number of products per page

    useEffect(() => {
        fetchProducts(currentPage);
        console.log(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page) => {
        try {
            console.log("fetch", page);

            const data = await productService.getProducts(page, itemsPerPage);
            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError("Failed to load products. Please try again.");
        }
    };

    const handleAddProduct = async (formData) => {
        console.log(formData);

        try {
            await productService.addProduct(formData, token);
            fetchProducts(currentPage); // Refresh product list
        } catch (err) {
            setError(`${err.response.data.message}`);
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            console.log(editingProduct.id);

            await productService.updateProduct(
                editingProduct.id,
                updatedProduct,
                token
            );
            fetchProducts(currentPage); // Refresh product list
            setEditingProduct(null); // Reset editing state
        } catch (err) {
            setError("Failed to update product. Please try again.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await productService.deleteProduct(productId, token);
            fetchProducts(currentPage); // Refresh product list
        } catch (err) {
            setError("Failed to delete product. Please try again.");
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={() => navigate("/all-orders")}
                        className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200"
                    >
                        View All Orders
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Product Form */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                    </h2>
                    <ProductForm
                        initialProduct={editingProduct}
                        onSubmit={
                            editingProduct
                                ? handleUpdateProduct
                                : handleAddProduct
                        }
                        onCancel={() => setEditingProduct(null)}
                    />
                </div>

                {/* Product Table */}
                <ProductTable
                    products={products}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                />

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 mx-1 rounded-full ${
                                currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                            } hover:bg-blue-500 hover:text-white`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
