import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/adminService";
import ProductManager from "../components/ProductManager";
import UserManager from "../components/UserManager";

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState("products");
	const [products, setProducts] = useState([]);
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch initial data for products and users
		fetchAdminData();
	}, []);

	const fetchAdminData = async () => {
		try {
			const [productData, userData] = await Promise.all([
				adminService.getProducts(),
				adminService.getUsers(),
			]);
			setProducts(productData);
			setUsers(userData);
		} catch (err) {
			setError("Failed to load data. Please try again.");
		}
	};

	const handleTabChange = (tab) => setActiveTab(tab);

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-blue-600 text-white py-4 px-6">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Admin Dashboard</h1>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex">
				{/* Sidebar */}
				<nav className="w-1/4 bg-white shadow-md min-h-screen">
					<ul className="space-y-4 py-6 px-4">
						<li
							className={`cursor-pointer p-2 rounded-lg ${
								activeTab === "products" ? "bg-blue-100" : ""
							} hover:bg-blue-50`}
							onClick={() => handleTabChange("products")}
						>
							Manage Products
						</li>
						<li
							className={`cursor-pointer p-2 rounded-lg ${
								activeTab === "users" ? "bg-blue-100" : ""
							} hover:bg-blue-50`}
							onClick={() => handleTabChange("users")}
						>
							Manage Users
						</li>
					</ul>
				</nav>

				{/* Content Area */}
				<main className="w-3/4 p-6">
					{error && (
						<div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
							{error}
						</div>
					)}

					{activeTab === "products" && (
						<ProductManager
							products={products}
							refreshData={fetchAdminData}
						/>
					)}

					{activeTab === "users" && (
						<UserManager
							users={users}
							refreshData={fetchAdminData}
						/>
					)}
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
