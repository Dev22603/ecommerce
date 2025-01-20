import React, { useEffect, useState, useContext } from "react";
import { cartService } from "../services/cartService";
import { productService } from "../services/productService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { orderService } from "../services/ordersService"; // Adjust the path if necessary

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useContext(AuthContext);
	const token = user?.token;
	console.log(token);

	useEffect(() => {
		fetchCartItems();
	}, []);

	const fetchCartItems = async () => {
		setLoading(true);
		try {
			const items = await cartService.getCart(1, 100, token);
			const updatedItems = await Promise.all(
				items.map(async (item) => {
					const product = await productService.getProductById(
						item.product_id
					);
					return {
						...item,
						price: product.sales_price,
						totalPrice: product.sales_price * item.quantity,
						stock: product.stock,
					};
				})
			);
			setCartItems(updatedItems);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateQuantity = async (productId, quantity) => {
		try {
			if (quantity > 0) {
				await cartService.updateCart(productId, quantity, token);
			} else {
				await cartService.removeItemFromCart(productId, token);
			}
			fetchCartItems();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const removeItem = async (productId) => {
		try {
			await cartService.removeItemFromCart(productId, token);
			fetchCartItems();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const placeOrder = async () => {
		try {
			console.log(token);

			// Place the order using the ordersService
			await orderService.createOrder(token);

			// Clear the cart
			// await cartService.clearCart(token);

			// Update the UI by clearing the cart state
			setCartItems([]);

			toast.success("Order placed successfully!", {
				autoClose: 1000, // Toast duration in milliseconds
			});
		} catch (error) {
			toast.error(error.message || "Failed to place order.");
		}
	};

	if (loading) {
		return <div className="text-center">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Your Cart</h1>
			{cartItems.length === 0 ? (
				<p className="text-center">Your cart is empty.</p>
			) : (
				<div className="grid gap-4">
					{cartItems.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
						>
							<div className="flex items-center gap-4">
								<img
									src={`http://localhost:5000/api${item.images[0]}`}
									alt={item.product_name}
									className="w-16 h-16 object-cover rounded-lg"
								/>
								<div>
									<h2 className="text-lg font-semibold">
										{item.product_name}
									</h2>
									<p>Price: ${item.price.toFixed(2)}</p>
									<p>Stock: {item.stock}</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<button
									className="px-2 py-1 bg-gray-200 rounded"
									onClick={() =>
										updateQuantity(
											item.product_id,
											item.quantity - 1
										)
									}
									disabled={item.quantity <= 1}
								>
									-
								</button>
								<span>{item.quantity}</span>
								<button
									className="px-2 py-1 bg-gray-200 rounded"
									onClick={() =>
										updateQuantity(
											item.product_id,
											item.quantity + 1
										)
									}
									disabled={item.quantity >= item.stock}
								>
									+
								</button>
							</div>
							<p>Total: ${item.totalPrice.toFixed(2)}</p>
							<button
								className="px-4 py-2 bg-red-500 text-white rounded"
								onClick={() => removeItem(item.product_id)}
							>
								Remove
							</button>
						</div>
					))}
				</div>
			)}
			{cartItems.length > 0 && (
				<button
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
					onClick={placeOrder}
				>
					Place Order
				</button>
			)}
		</div>
	);
};

export default Cart;
