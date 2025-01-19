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

	useEffect(() => {
		if (user) {
			fetchOrders(page);
		} else {
			toast.error("Please log in to view your orders.");
		}
	}, [user, page]);

	const handlePreviousPage = () => {
		if (page > 1) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (page < totalPages) setPage(page + 1);
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">My Orders</h1>

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
