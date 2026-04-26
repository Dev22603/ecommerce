import { pool } from "../db/db.mjs";
import {
	INSERT_USER,
	CHECK_USER_EXISTS,
	GET_USER_BY_EMAIL_ID,
	GET_USERS,
} from "../queries/user.queries.mjs";

export const userRepository = {
	findByEmail: async (email) => {
		const result = await pool.query(GET_USER_BY_EMAIL_ID, [email]);
		return result.rows[0];
	},

	existsByEmail: async (email) => {
		const result = await pool.query(CHECK_USER_EXISTS, [email]);
		return result.rows[0].exists;
	},

	create: async ({ name, email, password, role }) => {
		const result = await pool.query(INSERT_USER, [name, email, password, role]);
		return result.rows[0];
	},

	findAll: async () => {
		const result = await pool.query(GET_USERS);
		return result.rows;
	},
};