import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { AuthContext } from "../context/AuthContext";
import { productService } from "../services/productService";
import { toast } from "react-toastify";
import {
  HiOutlinePlus,
  HiOutlineClipboardList,
  HiOutlineCube,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlineRefresh,
} from "react-icons/hi";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const itemsPerPage = 10;

  useEffect(() => {
    if (isSearching) {
      handleSearch(currentPage);
    } else {
      fetchProducts(currentPage);
    }
  }, [currentPage]);

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const data = await productService.getProducts(page, itemsPerPage);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchProducts(page);
      return;
    }

    setLoading(true);
    try {
      setIsSearching(true);
      const result = await productService.getProductsByName(searchQuery, page, itemsPerPage);
      setProducts(result.products);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handleAddProduct = async (formData) => {
    try {
      await productService.addProduct(formData, token);
      toast.success("Product added successfully!");
      fetchProducts(currentPage);
      setIsFormOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await productService.updateProduct(editingProduct.id, updatedProduct, token);
      toast.success("Product updated successfully!");
      fetchProducts(currentPage);
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (err) {
      toast.error("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId, token);
      toast.success("Product deleted successfully!");
      fetchProducts(currentPage);
    } catch (err) {
      toast.error("Failed to delete product. Please try again.");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-nexus-900">
      {/* Header */}
      <div className="bg-nexus-850 border-b border-nexus-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-nexus-50">
                Admin Dashboard
              </h1>
              <p className="text-nexus-300 mt-1">
                Manage your products and inventory
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/all-orders" className="btn-secondary">
                <HiOutlineClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">View Orders</span>
              </Link>
              <button onClick={handleAddClick} className="btn-primary">
                <HiOutlinePlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Products</p>
                <p className="stat-value">{totalProducts}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <HiOutlineCube className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Current Page</p>
                <p className="stat-value">{currentPage}</p>
              </div>
              <div className="p-3 bg-status-info/10 rounded-xl">
                <span className="text-lg font-bold text-status-info">
                  /{totalPages}
                </span>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Items Per Page</p>
                <p className="stat-value">{itemsPerPage}</p>
              </div>
              <div className="p-3 bg-status-success/10 rounded-xl">
                <HiOutlineClipboardList className="w-6 h-6 text-status-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nexus-400" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                <HiOutlineSearch className="w-4 h-4" />
                Search
              </button>
              {isSearching && (
                <button type="button" onClick={clearSearch} className="btn-secondary">
                  <HiOutlineRefresh className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Section */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-nexus-600/50">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-nexus-50">
                {isSearching ? `Results for "${searchQuery}"` : "All Products"}
              </h2>
              <button
                onClick={() => isSearching ? handleSearch(currentPage) : fetchProducts(currentPage)}
                className="btn-ghost btn-sm"
              >
                <HiOutlineRefresh className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-nexus-700/20 rounded-xl animate-pulse">
                    <div className="w-12 h-12 bg-nexus-600 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-nexus-600 rounded w-1/3" />
                      <div className="h-3 bg-nexus-600 rounded w-1/4" />
                    </div>
                    <div className="h-8 bg-nexus-600 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductTable
                products={products}
                onEdit={handleEditClick}
                onDelete={handleDeleteProduct}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-nexus-600/50">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn pagination-btn-inactive disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const showPage =
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1;

                    if (!showPage) {
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span key={i} className="w-10 text-center text-nexus-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`pagination-btn ${
                          currentPage === pageNum
                            ? "pagination-btn-active"
                            : "pagination-btn-inactive"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn pagination-btn-inactive disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        initialProduct={editingProduct}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        onCancel={handleFormClose}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default AdminDashboard;
