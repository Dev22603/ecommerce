// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.mjs";

const signup = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const result = await pool.query("select * from Users where email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      // If a user with this email exists, send a response
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    // If no user exists with this email, proceed with sign up
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO Users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role]
    );
  } catch (error) {}
};
