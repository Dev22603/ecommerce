import React, { useState, useEffect } from "react";
import { orderService } from "../services/ordersService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { toast } from "react-toastify";

const MyOrders = () => {
	const { user } = useContext(AuthContext);
	const [orders, setOrders] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState(""); // For the "before" date
	const [endDate, setEndDate] = useState(""); // For the "after" date
	const [isSearching, setIsSearching] = useState(false); // Track if we are in search mode

	// Fetch orders
	const fetchOrders = async (page = 1) => {
		try {
			const response = await orderService.getUserOrders(user.token, page);
			const { orders, total_pages } = response;
			console.log(
				`Orders: ${orders.length} - Total Pages: ${total_pages}`
			);

			setOrders(orders);
			setTotalPages(total_pages);
		} catch (error) {
			console.error("Failed to fetch orders:", error);
			toast.error("Error fetching orders.");
		}
	};

	// Handle search by date
	const handleSearch = async (page = 1) => {
		if (!startDate && !endDate) {
			setIsSearching(false);
			fetchOrders(page); // Reset to default fetch if no date is selected
			return;
		}

		try {
			setIsSearching(true);
			const result = await orderService.searchOrdersByDate(
				user.token,
				startDate,
				endDate,
				page
			);
			const { orders, totalPages } = result;
			setOrders(orders);
			setTotalPages(totalPages);
			setPage(page);
		} catch (error) {
			console.error("Search failed:", error);
			toast.error("Search failed.");
		}
	};

	useEffect(() => {
		if (user) {
			if (isSearching) {
				handleSearch(page);
			} else {
				fetchOrders(page);
			}
		} else {
			toast.error("Please log in to view your orders.");
		}
	}, [user, page, startDate, endDate]);

	const handlePreviousPage = () => {
		if (page > 1) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (page < totalPages) setPage(page + 1);
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">My Orders</h1>

			{/* Search Section */}
			<div className="mb-6 flex items-center gap-4">
				{/* Date range selection */}
				<input
					type="month"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					className="border rounded-lg p-2"
					placeholder="Start Date (Month/Year)"
				/>
				<input
					type="month"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					className="border rounded-lg p-2"
					placeholder="End Date (Month/Year)"
				/>
				<button
					onClick={() => handleSearch(1)} // Reset to page 1 on new search
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Search
				</button>
			</div>

			{/* Orders Table */}
			{orders.length === 0 ? (
				<p>No orders found.</p>
			) : (
				<div>
					<table className="min-w-full bg-white border border-gray-300 shadow-sm">
						<thead>
							<tr>
								<th className="px-4 py-2 text-left border-b">
									Order ID
								</th>
								<th className="px-4 py-2 text-left border-b">
									Total Amount
								</th>
								<th className="px-4 py-2 text-left border-b">
									Created At
								</th>
								<th className="px-4 py-2 text-left border-b">
									Order Items
								</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order.order_id} className="border-b">
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

					{/* Pagination Controls */}
					<div className="flex justify-center items-center mt-6">
						<button
							onClick={handlePreviousPage}
							disabled={page === 1}
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
						>
							Previous
						</button>
						<span className="mx-4">
							Page {page} of {totalPages}
						</span>
						<button
							onClick={handleNextPage}
							disabled={page === totalPages}
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyOrders;
