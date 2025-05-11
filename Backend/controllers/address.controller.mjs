import db from "../db/index.js";
import {
	INSERT_ADDRESS,
	GET_ALL_ADDRESSES_BY_USER,
	UPDATE_ADDRESS,
	CHECK_ADDRESS_USED_IN_ORDERS,
	SOFT_DELETE_ADDRESS,
	HARD_DELETE_ADDRESS,
} from "../queries/address.queries.mjs";
import { GLOBAL_ERROR_MESSAGES } from "../utils/constants/constants.mjs";
import { addressSchema } from "../utils/validators/address.validator.mjs";

// CREATE - Add new address
export const createAddress = async (req, res) => {
	try {
		const {
			full_name,
			phone,
			pincode,
			house_number,
			area,
			landmark,
			city,
			state,
			address_type = "Home",
		} = req.body;
		const user_id = req.user.id; // assuming you have user info from JWT token

		const { error } = addressSchema.validate(parsedBody, {
			abortEarly: false,
		});
		if (error) {
			const errors = error.details.map((e) => e.message);
			return res
				.status(400)
				.json({ message: "Validation failed", errors });
		}

		const { rows } = await db.query(INSERT_ADDRESS, [
			user_id,
			full_name,
			phone,
			pincode,
			house_number,
			area,
			landmark,
			city,
			state,
			address_type,
		]);

		res.status(201).json({ success: true, address: rows[0] });
	} catch (err) {
		console.error("Error creating address:", err);
		res.status(500).json({
			success: false,
			error: GLOBAL_ERROR_MESSAGES.SERVER_ERROR,
		});
	}
};

// READ - Get all addresses for a user
export const getAddressesByUser = async (req, res) => {
	try {
		const userId = req.user.id;
		const { rows } = await db.query(GET_ALL_ADDRESSES_BY_USER, [userId]);

		res.status(200).json({ success: true, addresses: rows });
	} catch (err) {
		console.error("Error fetching addresses:", err);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
};

// UPDATE - Update an address by ID
export const updateAddress = async (req, res) => {
	try {
		const addressId = req.params.id;
		const {
			full_name,
			phone,
			pincode,
			house_number,
			area,
			landmark,
			city,
			state,
			address_type,
		} = req.body;

		const { rows } = await db.query(UPDATE_ADDRESS, [
			addressId,
			full_name,
			phone,
			pincode,
			house_number,
			area,
			landmark,
			city,
			state,
			address_type,
		]);

		if (rows.length === 0) {
			return res.status(404).json({
				success: false,
				error: "Address not found or already deleted",
			});
		}

		res.status(200).json({ success: true, address: rows[0] });
	} catch (err) {
		console.error("Error updating address:", err);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
};

// DELETE - Smart delete (soft if used, hard if not)
export const deleteAddress = async (req, res) => {
	try {
		const addressId = req.params.id;

		// Check if address is used in orders
		const { rows } = await db.query(CHECK_ADDRESS_USED_IN_ORDERS, [
			addressId,
		]);
		const isUsed = rows[0].exists;

		if (isUsed) {
			await db.query(SOFT_DELETE_ADDRESS, [addressId]);
			return res.status(200).json({
				success: true,
				message: "Address soft deleted (in use)",
			});
		} else {
			await db.query(HARD_DELETE_ADDRESS, [addressId]);
			return res.status(200).json({
				success: true,
				message: "Address permanently deleted",
			});
		}
	} catch (err) {
		console.error("Error deleting address:", err);
		res.status(500).json({
			success: false,
			error: GLOBAL_ERROR_MESSAGES.SERVER_ERROR,
		});
	}
};
