import { pool } from "../db/db.mjs";

const createProduct = async (req, res) => {
    try {
        console.log(req.files);

        const product_name = req.body.product_name?.trim();
        const ws_code = parseInt(req.body.ws_code?.trim(), 10); // Convert to integer after trimming
        const sales_price = parseInt(req.body.sales_price?.trim(), 10); // Convert to integer after trimming
        const mrp = parseInt(req.body.mrp?.trim(), 10); // Convert to integer after trimming
        const package_size = parseInt(req.body.package_size?.trim(), 10); // Convert to integer after trimming
        const tags = req.body.tags.split(",").map((tag) => tag.trim());
        const category_id = parseInt(req.body.category_id?.trim(), 10); // Convert to integer after trimming
        const stock = parseInt(req.body.stock?.trim(), 10); // Convert to integer after trimming

        if (!product_name) {
            return res
                .status(400)
                .json({ message: "Product name is required." });
        }
        if (!ws_code) {
            return res.status(400).json({ message: "WS Code is required." });
        }
        if (ws_code <= 0) {
            return res.status(400).json({
                message: "WS Code cannot be less than or equal to 0.",
            });
        }
        if (sales_price <= 0) {
            return res.status(400).json({
                message: "Sales Price cannot be less than or equal to 0.",
            });
        }
        if (mrp <= 0) {
            return res.status(400).json({
                message: "MRP cannot be less than or equal to 0.",
            });
        }
        if (package_size <= 0) {
            return res.status(400).json({
                message: "Package Size cannot be less than or equal to 0.",
            });
        }
        if (category_id <= 0) {
            return res.status(400).json({
                message: "Category ID cannot be less than or equal to 0.",
            });
        }
        const categoryExists = await pool.query(
            "SELECT * FROM Categories WHERE id = $1",
            [category_id]
        );
        if (categoryExists.rows.length == 0) {
            return res.status(400).json({ error: "Category does not exist" });
        }
        if (!sales_price) {
            return res
                .status(400)
                .json({ message: "Sales Price is required." });
        }
        if (!mrp) {
            return res.status(400).json({ message: "MRP is required." });
        }
        if (!package_size) {
            return res
                .status(400)
                .json({ message: "Package Size is required." });
        }
        if (!category_id) {
            return res
                .status(400)
                .json({ message: "Category ID is required." });
        }
        if (!stock) {
            return res.status(400).json({ message: "Stock is required." });
        }
        if (stock < 0) {
            return res
                .status(400)
                .json({ message: "Stock cannot be less than 0." });
        }
        if (tags.length === 0) {
            return res.status(400).json({ message: "Tags are required." });
        }

        const imageURLs = req.files
            ? req.files.map((file) => `/uploads/${file.filename}`)
            : [];

        if (imageURLs.length === 0) {
            return res
                .status(400)
                .json({ message: "At least one image is required." });
        }

        const result = await pool.query(
            "INSERT INTO Products (product_name, ws_code, sales_price, mrp, package_size, images, tags, category_id, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                imageURLs, // Array of image URLs
                tags, // PostgreSQL expects an array
                category_id,
                stock,
            ]
        );

        res.status(201).json({
            message: "Product added successfully",
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err);

        // Check for unique constraint violation on ws_code
        if (err.code === "23505") {
            return res.status(400).json({
                message:
                    "Product code (ws_code) already exists. Please provide a unique ws_code.",
            });
        }

        // Handle other errors
        res.status(500).json({ message: "Error creating product", err });
    }
};
export { createProduct };
