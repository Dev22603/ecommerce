import { pool } from "../db/db.mjs";

// Create order from cart
const createOrder = async (req, res) => {
	const user_id = req.user.id; // assuming you have user info from JWT token
	try {
		// Start a transaction
		await pool.query("BEGIN");
		// Calculate total amount from the cart
		const totalAmountResult = await pool.query(
			`SELECT COALESCE(SUM(p.sales_price * c.quantity), 0) AS total_amount
         FROM Carts c
         JOIN Products p ON c.product_id = p.id
         WHERE c.user_id = $1`,
			[user_id]
		);

		const total_amount = parseFloat(totalAmountResult.rows[0].total_amount);

		// Create the order
		const orderResult = await pool.query(
			"INSERT INTO Orders (user_id, total_amount) VALUES ($1, $2) RETURNING id",
			[user_id, total_amount]
		);
		const order_id = orderResult.rows[0].id;

		// Get the items from the user's cart
		const cartItems = await pool.query(
			"SELECT product_id, quantity FROM Carts WHERE user_id = $1",
			[user_id]
		);

		if (cartItems.rows.length === 0) {
			// If the cart is empty, rollback the transaction
			await pool.query("ROLLBACK");
			return res
				.status(400)
				.json({ message: "Cart is empty. Cannot create an order." });
		}

		// Insert items into Order_Items
		for (const item of cartItems.rows) {
			await pool.query(
				"INSERT INTO Order_Items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
				[order_id, item.product_id, item.quantity]
			);
		}

		// Clear the user's cart
		await pool.query("DELETE FROM Carts WHERE user_id = $1", [user_id]);

		// Commit the transaction
		await pool.query("COMMIT");

		res.status(201).json({
			message: "Order created successfully",
			order_id,
		});
	} catch (error) {
		// Rollback the transaction in case of an error
		await pool.query("ROLLBACK");
		res.status(500).json({
			message: "Error creating order",
			error: error.message,
		});
	}
};

// Get user's orders
const getUserOrders = async (req, res) => {
    
	const user_id = req.user.id; // assuming you have user info from JWT token

	try {
		const result = await pool.query(
			"SELECT * FROM Orders WHERE user_id = $1",
			[user_id]
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ message: "Error fetching orders", error });
	}
};

export { createOrder, getUserOrders };
