import { User } from "../models/user.mjs";
import { Cart } from "../models/cart.mjs";
import { Product } from "../models/product.mjs";
import { OrderItem } from "../models/orderItem.mjs";
import { Order } from "../models/order.mjs";

// Create order from cart
const createOrder = async (req, res) => {
	const user_id = req.user.id; // assuming you have user info from JWT token
	try {
		// Start a transaction
		const t = await sequelize.transaction();

		// Calculate total amount from the cart
		const totalAmountResult = await Cart.sum("quantity", {
			include: {
				model: Product,
				attributes: ["sales_price"],
				required: true,
			},
			where: {
				user_id: user_id,
			},
			transaction: t,
		});

		const total_amount = parseFloat(totalAmountResult);

		// Create the order
		const order = await Order.create(
			{
				user_id,
				total_amount,
			},
			{ transaction: t }
		);

		const order_id = order.id;

		// Get the items from the user's cart
		const cartItems = await Cart.findAll({
			where: { user_id },
			include: [
				{
					model: Product,
					attributes: ["id", "sales_price"],
				},
			],
			transaction: t,
		});

		if (cartItems.length === 0) {
			// If the cart is empty, rollback the transaction
			await t.rollback();
			return res
				.status(400)
				.json({ message: "Cart is empty. Cannot create an order." });
		}

		// Insert items into Order_Items
		const orderItems = cartItems.map((item) => ({
			order_id,
			product_id: item.product_id,
			quantity: item.quantity,
			price: item.product.sales_price,
		}));

		await OrderItem.bulkCreate(orderItems, { transaction: t });

		// Clear the user's cart
		await Cart.destroy({
			where: { user_id },
			transaction: t,
		});

		// Commit the transaction
		await t.commit();

		res.status(201).json({
			message: "Order created successfully",
			order_id,
		});
	} catch (error) {
		// Rollback the transaction in case of an error
		if (t) await t.rollback();
		res.status(500).json({
			message: "Error creating order",
			error: error.message,
		});
	}
};

// Get user's orders v2 pagination
const getUserOrders = async (req, res) => {
	const user_id = req.user.id; // Assuming the user info is provided by JWT token
	const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

	try {
		// Validate page and limit
		const validatedPage = Math.max(1, parseInt(page, 10) || 1);
		const validatedLimit = Math.max(1, parseInt(limit, 10) || 10);
		const offset = (validatedPage - 1) * validatedLimit;

		// Query to get total orders count for pagination
		const totalCount = await Order.count({
			where: { user_id },
		});

		// Query to fetch the user's paginated orders with order details
		const orders = await Order.findAll({
			where: { user_id },
			include: [
				{
					model: OrderItem,
					include: [
						{
							model: Product,
							attributes: ["product_name"],
						},
					],
				},
			],
			order: [["created_at", "DESC"]],
			limit: validatedLimit,
			offset,
		});

		// If no orders are found
		if (!orders.length) {
			return res.status(404).json({ message: "No orders found" });
		}

		// Format the orders to group by order_id
		const formattedOrders = orders.map((order) => ({
			order_id: order.id,
			user_id: order.user_id,
			total_amount: parseFloat(order.total_amount),
			created_at: order.created_at.toLocaleDateString("en-GB"),
			order_items: order.OrderItems.map((item) => ({
				product_id: item.product_id,
				product_name: item.Product.product_name,
				quantity: item.quantity,
				sales_price: parseFloat(item.price),
			})),
		}));

		res.status(200).json({
			page: validatedPage,
			limit: validatedLimit,
			total_count: totalCount,
			total_pages: Math.ceil(totalCount / validatedLimit),
			orders: formattedOrders,
		});
	} catch (error) {
		console.error("Error fetching user orders:", error);
		res.status(500).json({
			message: "An error occurred while fetching user orders",
		});
	}
};

const getOrderDetails = async (req, res) => {
	const { order_id } = req.params;

	try {
		const order = await Order.findOne({
			where: { id: order_id },
			include: [
				{
					model: OrderItem,
					include: [
						{
							model: Product,
							attributes: ["product_name"],
						},
					],
				},
			],
		});

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		const formattedDate = order.created_at.toLocaleDateString("en-GB");

		const response = {
			order_id: order.id,
			user_id: order.user_id,
			total_amount: parseFloat(order.total_amount),
			created_at: formattedDate,
			order_items: order.OrderItems.map((item) => ({
				product_id: item.product_id,
				product_name: item.Product.product_name,
				quantity: item.quantity,
				sales_price: parseFloat(item.price),
			})),
		};

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching order details",
			error,
		});
	}
};

// Cancel order
const cancelOrder = async (req, res) => {
	const { order_id } = req.params;
	const user_id = req.user.id;

	try {
		// Check if the order exists and belongs to the user
		const order = await Order.findOne({ where: { id: order_id, user_id } });

		if (!order) {
			return res
				.status(404)
				.json({ message: "Order not found or access denied" });
		}

		if (order.status !== "Pending") {
			return res
				.status(400)
				.json({ message: "Cannot cancel order that is not pending." });
		}

		// Delete the order and related items
		await OrderItem.destroy({ where: { order_id } });
		await order.destroy();

		res.status(200).json({ message: "Order cancelled successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error cancelling order", error });
	}
};

// Update order status
const updateOrderStatus = async (req, res) => {
	const { order_id } = req.params;
	const { status } = req.body;

	const validStatuses = ["Pending", "Shipped", "Completed", "Cancelled"];

	if (!validStatuses.includes(status)) {
		return res.status(400).json({
			message:
				"Invalid status. Allowed values are: Pending, Shipped, Completed, Cancelled.",
		});
	}

	try {
		const order = await Order.findOne({ where: { id: order_id } });

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		order.status = status;
		await order.save();

		res.status(200).json({
			message: "Order status updated successfully",
			order,
		});
	} catch (error) {
		res.status(500).json({ message: "Error updating order status", error });
	}
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;

	try {
		const offset = (page - 1) * limit;

		const totalOrders = await Order.count();

		const orders = await Order.findAll({
			include: [
				{
					model: User,
					attributes: ["name"],
				},
				{
					model: OrderItem,
					include: [
						{
							model: Product,
							attributes: ["product_name"],
						},
					],
				},
			],
			order: [["created_at", "DESC"]],
			limit,
			offset,
		});

		if (!orders.length) {
			return res.status(404).json({ message: "No orders found" });
		}

		const formattedOrders = orders.map((order) => ({
			order_id: order.id,
			user_id: order.user_id,
			user_name: order.User.name,
			total_amount: parseFloat(order.total_amount),
			created_at: order.created_at.toLocaleDateString("en-GB"),
			status: order.status,
			order_items: order.OrderItems.map((item) => ({
				product_id: item.product_id,
				product_name: item.Product.product_name,
				quantity: item.quantity,
				sales_price: parseFloat(item.price),
			})),
		}));

		res.status(200).json({
			page,
			limit,
			totalOrders,
			totalPages: Math.ceil(totalOrders / limit),
			orders: formattedOrders,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error fetching all orders",
			error,
		});
	}
};

export {
	createOrder,
	getUserOrders,
	getOrderDetails,
	cancelOrder,
	updateOrderStatus,
	getAllOrders,
};
