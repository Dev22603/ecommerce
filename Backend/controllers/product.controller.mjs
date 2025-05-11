import { pool } from "../db/db.mjs";
import {
	CHECK_CATEGORY_EXISTS,
	INSERT_PRODUCT,
	COUNT_PRODUCTS_BY_NAME,
	SEARCH_PRODUCTS_BY_NAME,
} from "../queries/product.queries.mjs";
import {
	GLOBAL_ERROR_MESSAGES,
	PRODUCT_FEEDBACK_MESSAGES,
	PRODUCT_VALIDATION_ERRORS,
} from "../utils/constants/product.constants.mjs";
import { productSchema } from "../utils/validators/product.validator.mjs";

const createProduct = async (req, res) => {
	try {
		console.log(req.files);

		const parsedBody = {
			product_name: req.body.product_name?.trim(),
			sales_price: parseInt(req.body.sales_price.trim()),
			mrp: parseInt(req.body.mrp.trim()),
			category_id: parseInt(req.body.category_id.trim()),
			stock: parseInt(req.body.stock.trim()),
		};

		const { error } = productSchema.validate(parsedBody, {
			abortEarly: false,
		});
		if (error) {
			const errors = error.details.map((e) => e.message);
			return res
				.status(400)
				.json({ message: "Validation failed", errors });
		}

		const categoryExists = await pool.query(CHECK_CATEGORY_EXISTS, [
			parsedBody.category_id,
		]);
		if (categoryExists.rows.length === 0) {
			return res
				.status(400)
				.json({ error: PRODUCT_VALIDATION_ERRORS.CATEGORY_NOT_FOUND });
		}

		const imageURLs = req.files
			? req.files.map((file) => `/uploads/${file.filename}`)
			: [];

		if (imageURLs.length === 0) {
			return res
				.status(400)
				.json({ message: PRODUCT_VALIDATION_ERRORS.IMAGE_REQUIRED });
		}

		const result = await pool.query(INSERT_PRODUCT, [
			parsedBody.product_name,
			parsedBody.sales_price,
			parsedBody.mrp,
			imageURLs,
			parsedBody.category_id,
			parsedBody.stock,
		]);

		res.status(201).json({
			message: PRODUCT_FEEDBACK_MESSAGES.PRODUCT_ADDED_SUCCESS,
			data: result.rows[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR,
			err,
		});
	}
};

const searchProductsByName = async (req, res) => {
	const { product_name } = req.params;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const offset = (page - 1) * limit;

	try {
		// Execute search query
		const { rows: products } = await pool.query(SEARCH_PRODUCTS_BY_NAME, [
			`%${product_name}%`,
			limit,
			offset,
		]);
		// Get total count
		const { rows } = await pool.query(COUNT_PRODUCTS_BY_NAME, [
			`%${product_name}%`,
		]);
		const totalCount = parseInt(rows[0].count, 10);

		res.status(200).json({
			products,
			totalCount,
			page,
			limit,
			totalPages: Math.ceil(totalCount / limit),
			message: PRODUCT_FEEDBACK_MESSAGES.NO_PRODUCTS_FOUND,
		});
	} catch (err) {
		console.error("Error searching products:", err);
		res.status(500).json({ error: "Error fetching products by name" });
	}
};
export { createProduct, searchProductsByName };
