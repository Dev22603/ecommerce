import React, { useState, useEffect, useContext } from "react";
import { orderService } from "../services/ordersService";
import { AuthContext } from "../context/AuthContext";

const AllOrders = () => {
	const getStatusColor = (status) => {
		switch (status) {
			case "Pending":
				return "bg-yellow-200 text-yellow-800";
			case "Shipped":
				return "bg-blue-200 text-blue-800";
			case "Completed":
				return "bg-green-200 text-green-800";
			case "Cancelled":
				return "bg-red-200 text-red-800";
			default:
				return "bg-gray-200 text-gray-800";
		}
	};

	const { user } = useContext(AuthContext);
	const [ordersData, setOrdersData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [error, setError] = useState(null);
	const [salesSummary, setSalesSummary] = useState({
		totalRevenue: 0,
		totalOrders: 0,
	});
	const [productSummary, setProductSummary] = useState([]);
	const [loading, setLoading] = useState(false); // Loading indicator for updates

	const token = user?.token;

	const fetchAllOrders = async (page) => {
		try {
			const data = await orderService.getAllOrders(token, page);

			// Consolidate all orders into a single array with user names included
			const allOrders = data.users.flatMap((user) =>
				user.orders.map((order) => ({
					...order,
					user_name: user.user_name,
				}))
			);

			setOrdersData(allOrders);
			setTotalPages(data.totalPages);

			// Update sales and product summaries
			const totalRevenue = allOrders.reduce(
				(sum, order) => sum + order.total_amount,
				0
			);

			const totalOrders = allOrders.length;

			const productCounts = {};
			allOrders.forEach((order) => {
				order.order_items.forEach((item) => {
					productCounts[item.product_name] =
						(productCounts[item.product_name] || 0) + item.quantity;
				});
			});

			const productSummaryData = Object.entries(productCounts).map(
				([productName, quantitySold]) => ({
					productName,
					quantitySold,
				})
			);

			setSalesSummary({ totalRevenue, totalOrders });
			setProductSummary(productSummaryData);
		} catch (err) {
			setError("Failed to fetch orders. Please try again.");
		}
	};

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			setLoading(true);
			await orderService.updateOrderStatus(token, orderId, newStatus);
			// Update the status locally
			setOrdersData((prevOrders) =>
				prevOrders.map((order) =>
					order.order_id === orderId
						? { ...order, status: newStatus }
						: order
				)
			);
			setError(null);
		} catch (err) {
			setError("Failed to update order status. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchAllOrders(currentPage);
		}
	}, [token, currentPage]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
			<h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
				All Orders
			</h1>
			{error && (
				<div className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg">
					{error}
				</div>
			)}

			{/* Unified Orders Table */}
			{ordersData.length === 0 ? (
				<p className="text-gray-600 text-center">No orders found.</p>
			) : (
				<div>
					<table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
						<thead className="bg-blue-200">
							<tr>
								<th className="px-4 py-2 border-b text-left text-gray-700">
									Name
								</th>
								<th className="px-4 py-2 border-b text-left text-gray-700">
									Order ID
								</th>
								<th className="px-4 py-2 border-b text-left text-gray-700">
									Total Amount
								</th>
								<th className="px-4 py-2 border-b text-left text-gray-700">
									Created At
								</th>
								<th className="px-4 py-2 border-b text-left text-gray-700">
									Status
								</th>
								<th className="px-4 py-2 border-b text-left text-gray-700">
									Order Items
								</th>
							</tr>
						</thead>
						<tbody>
							{ordersData.map((order) => (
								<tr
									key={order.order_id}
									className="border-b hover:bg-blue-50"
								>
									<td className="px-4 py-2">
										{order.user_name}
									</td>
									<td className="px-4 py-2">
										{order.order_id}
									</td>
									<td className="px-4 py-2">
										${order.total_amount}
									</td>
									<td className="px-4 py-2">
										{order.created_at}
									</td>
									<td className="px-4 py-2">
										<select
											value={order.status}
											onChange={(e) =>
												handleStatusChange(
													order.order_id,
													e.target.value
												)
											}
											disabled={loading}
											// className="px-2 py-1 rounded border border-gray-300"
											className={`px-2 py-1 rounded border border-gray-300 ${getStatusColor(
												order.status
											)}`}
										>
											<option
												value="Pending"
												className="bg-white text-black"
											>
												Pending
											</option>
											<option
												value="Shipped"
												className="bg-white text-black"
											>
												Shipped
											</option>
											<option
												value="Completed"
												className="bg-white text-black"
											>
												Completed
											</option>
											<option
												value="Cancelled"
												className="bg-white text-black"
											>
												Cancelled
											</option>
										</select>
									</td>
									<td className="px-4 py-2">
										<ul>
											{order.order_items.map((item) => (
												<li key={item.product_id}>
													{item.product_name} (x
													{item.quantity}) - $
													{item.sales_price}
												</li>
											))}
										</ul>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Pagination */}
					<div className="flex justify-center mt-6">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2 hover:bg-gray-300 disabled:opacity-50"
						>
							Previous
						</button>
						<span className="text-blue-800 font-bold">
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded ml-2 hover:bg-gray-300 disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			)}

			{/* Sales Summary */}
			<div className="mt-12">
				<h2 className="text-2xl font-bold text-blue-800 mb-4">
					Summary
				</h2>
				<div className="grid grid-cols-2 gap-4">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold text-gray-800">
							Sales Summary
						</h3>
						<p className="mt-2 text-gray-600">
							<span className="font-bold">Total Revenue:</span> $
							{salesSummary.totalRevenue.toFixed(2)}
						</p>
						<p className="mt-2 text-gray-600">
							<span className="font-bold">Total Orders:</span>{" "}
							{salesSummary.totalOrders}
						</p>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold text-gray-800">
							Products Sold Summary
						</h3>
						<ul className="mt-2 text-gray-600">
							{productSummary.map((product) => (
								<li key={product.productName}>
									{product.productName}:{" "}
									<span className="font-bold">
										{product.quantitySold}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AllOrders;
