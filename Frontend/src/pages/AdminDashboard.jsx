import React, { useState, useEffect } from "react";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { adminService } from "../services/adminService";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const itemsPerPage = 10; // Number of products per page

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const data = await adminService.getProducts(page, itemsPerPage);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      await adminService.addProduct(newProduct);
      fetchProducts(currentPage); // Refresh product list
    } catch (err) {
      setError(`Failed to add product. Please try again.${err}`);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await adminService.updateProduct(updatedProduct.id, updatedProduct);
      fetchProducts(currentPage); // Refresh product list
      setEditingProduct(null); // Reset editing state
    } catch (err) {
      setError("Failed to update product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await adminService.deleteProduct(productId);
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
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
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


// import React, { useState, useEffect } from "react";
// import { adminService } from "../services/adminService";
// import ProductManager from "../components/ProductManager";

// const AdminDashboard = () => {
// 	const [products, setProducts] = useState([]);
// 	const [error, setError] = useState(null);

// 	useEffect(() => {
// 		// Fetch initial data for products
// 		fetchAdminData();
// 	}, []);

// 	const fetchAdminData = async () => {
// 		try {
// 			const productData = await adminService.getProducts();
// 			setProducts(productData);
// 		} catch (err) {
// 			setError("Failed to load data. Please try again.");
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen bg-gray-100">
// 			{/* Header */}
// 			<header className="bg-blue-600 text-white py-4 px-6">
// 				<div className="flex justify-between items-center">
// 					<h1 className="text-2xl font-bold">Admin Dashboard</h1>
// 				</div>
// 			</header>

// 			{/* Main Content */}
// 			<main className="p-6">
// 				{error && (
// 					<div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
// 						{error}
// 					</div>
// 				)}

// 				{/* Product Manager */}
// 				<ProductManager products={products} refreshData={fetchAdminData} />
// 			</main>
// 		</div>
// 	);
// };

// export default AdminDashboard;


