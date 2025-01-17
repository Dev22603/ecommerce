// controllers/user.controllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.mjs";

// const signup = async (req, res) => {
// 	const { name, email, password, role } = req.body;
// 	console.log(req.body);

// 	try {
// 		const result = await pool.query(
// 			"select * from Users where email = $1",
// 			[email]
// 		);
// 		if (result.rows.length > 0) {
// 			// If a user with this email exists, send a response
// 			return res
// 				.status(400)
// 				.json({ error: "User with this email already exists" });
// 		}
// 		// If no user exists with this email, proceed with sign up

// 		if (role === "admin") {
// 			const adminExists = await pool.query(
// 				"SELECT * FROM Users WHERE role = $1",
// 				["admin"]
// 			);
// 			if (adminExists.rows.length > 0) {
// 				return res.status(400).json({ error: "admin already exists" });
// 			}
// 		}

// 		const hashedPassword = await bcrypt.hash(password, 10);

// 		// Insert the new user into the database
// 		const newUser = await pool.query(
// 			"INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
// 			[name, email, hashedPassword, role]
// 		);
// 		const user = newUser.rows[0];
// 		res.status(201).json({
// 			id: user.id,
// 			name: user.name,
// 			email: user.email,
// 			role: user.role,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: "Error creating user" });
// 	}
// };


// better signup        
const signup = async (req, res) => {
	const { name, email, password } = req.body;
	console.log(req.body);

	// Convert email to lowercase
	const lowerCaseEmail = email.toLowerCase();

	try {
		// Check if a user with this email already exists (in lowercase)
		const result = await pool.query(
			"SELECT * FROM Users WHERE email = $1",
			[lowerCaseEmail]
		);
		if (result.rows.length > 0) {
			// If a user with this email exists, send a response
			return res
				.status(400)
				.json({ error: "User with this email already exists" });
		}

		// Determine the role based on email (case insensitive)
		let role = lowerCaseEmail.endsWith('@medkart.in') ? 'admin' : 'customer';

		// If role is 'admin', check if an admin already exists
		if (role === 'admin') {
			const adminExists = await pool.query(
				"SELECT * FROM Users WHERE role = $1",
				['admin']
			);
			if (adminExists.rows.length > 0) {
				return res.status(400).json({ error: "An admin already exists" });
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert the new user into the database with the automatically assigned role
		const newUser = await pool.query(
			"INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
			[name, lowerCaseEmail, hashedPassword, role]
		);
		const user = newUser.rows[0];

		res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creating user" });
	}
};




// Login controller
const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await pool.query(
			"SELECT * FROM Users WHERE email = $1",
			[email]
		);
		const user = result.rows[0];
		console.log(req.body);

		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		// Create JWT token
		const token = jwt.sign(
			{ id: user.id, username: user.username, role: user.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);
		console.log("token");

		res.status(200).json({ token: token, role: user.role });
	} catch (err) {
		res.status(500).json({ error: "Login failed" });
	}
};

const getAllUsers = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM Users");
		const users = result.rows;
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ error: "Error fetching users" });
	}
};

export { signup, login, getAllUsers };
