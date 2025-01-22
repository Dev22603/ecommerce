// controllers/user.controllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.mjs"; // Import User model from Sequelize

// Signup function
const signup = async (req, res) => {
	console.log(req.body);
	const name = req.body.name?.trim();
	const email = req.body.email?.trim();
	const password = req.body.password?.trim();

	if (!name || name.length < 2 || name.length > 100) {
		return res.status(400).json({
			error: "Name must be between 2 and 100 characters long",
		});
	}

	const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	if (!email || !emailRegex.test(email)) {
		return res.status(400).json({
			error: "Invalid email format",
		});
	}

	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

	if (!password || !passwordRegex.test(password)) {
		return res.status(400).json({
			error: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
		});
	}

	const lowerCaseEmail = email.toLowerCase();

	try {
		// Check if a user with this email already exists
		const existingUser = await User.findOne({
			where: { email: lowerCaseEmail },
		});

		if (existingUser) {
			return res
				.status(400)
				.json({ error: "User with this email already exists" });
		}

		let role = lowerCaseEmail.endsWith("@medkart.in")
			? "admin"
			: "customer";

		// Ensure only one admin exists
		if (role === "admin") {
			const adminExists = await User.findOne({
				where: { role: "admin" },
			});
			if (adminExists) {
				return res
					.status(400)
					.json({ error: "An admin already exists" });
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the new user
		const newUser = await User.create({
			name,
			email: lowerCaseEmail,
			password: hashedPassword,
			role,
		});

		res.status(201).json({
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			role: newUser.role,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creating user" });
	}
};

// Login function
const login = async (req, res) => {
	const email = req.body.email?.trim().toLowerCase();
	const password = req.body.password?.trim();

	try {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign(
			{
				id: user.id,
				role: user.role,
				name: user.name,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "3h" }
		);

		res.status(200).json({
			token,
			role: user.role,
			name: user.name,
		});
	} catch (err) {
		res.status(500).json({ error: "Login failed" });
	}
};

// Get all users function
const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll(); // Fetch all users from the database
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({ error: "Error fetching users" });
	}
};

export { signup, login, getAllUsers };
