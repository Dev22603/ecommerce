import { pool } from "../db/db.mjs";
// Add item to cart

const addItemToCart = async (req, res) => {
	const { product_id, quantity } = req.body;
	const user_id = req.user.id;
	try {
		const result = await pool.query(
			"INSERT INTO Carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
			[user_id, product_id, quantity]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ message: "Error adding item to cart", error });
	}
};
// Get user's cart

const getCart = async (req, res) => {
	const user_id = req.user.id; // assuming you have user info from JWT token

	try {
		const result = await pool.query(
			"SELECT * FROM Carts WHERE user_id = $1",
			[user_id]
		);
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ message: "Error fetching cart", error });
	}
};

// Update cart item
const updateCart = async (req, res) => {
	const { product_id, quantity } = req.body;
	const user_id = req.user.id; // assuming you have user info from JWT token

	try {
		const result = await pool.query(
			"UPDATE Carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *",
			[quantity, user_id, product_id]
		);
		res.status(200).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ message: "Error updating cart item", error });
	}
};
// Remove item from cart
const removeItemFromCart = async (req, res) => {
	const { product_id } = req.params;
	const user_id = req.user.id; // assuming you have user info from JWT token

	try {
		await pool.query(
			"DELETE FROM Carts WHERE user_id = $1 AND product_id = $2",
			[user_id, product_id]
		);
		res.status(200).json({ message: "Item removed from cart" });
	} catch (error) {
		res.status(500).json({
			message: "Error removing item from cart",
			error,
		});
	}
};

export { getCart, updateCart, removeItemFromCart, addItemToCart };
