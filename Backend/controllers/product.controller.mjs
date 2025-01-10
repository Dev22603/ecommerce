import { pool } from "../db/db.mjs";

const createProduct = async (req, res) => {
    const {
        product_name,
        ws_code,
        sales_price,
        mrp,
        package_size,
        images,
        tags,
        category_id,
    } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO Products (product_name, ws_code, sales_price, mrp, package_size, images, tags, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                images,
                tags,
                category_id,
            ]
        );

        const product = result.rows[0];
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: "Error creating product" });
        console.log(err);
    }
};

const createCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO Categories (category_name) VALUES ($1) RETURNING *",
            [category_name]
        );
        const category = result.rows[0];
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: "Error creating category" });
        console.log(err);
    }
};

const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Products");
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM Products WHERE id = $1",
            [id]
        );
        const product = result.rows[0];

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: "Error fetching product" });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM Products WHERE id = $1 RETURNING *",
            [id]
        );
        const product = result.rows[0];

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        product_name,
        ws_code,
        sales_price,
        mrp,
        package_size,
        images,
        tags,
        category_id,
    } = req.body;

    try {
        const result = await pool.query(
            "UPDATE Products SET product_name = $1, ws_code = $2, sales_price = $3, mrp = $4, package_size = $5, images = $6, tags = $7, category_id = $8 WHERE id = $9 RETURNING *",
            [
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                images,
                tags,
                category_id,
                id,
            ]
        );

        const product = result.rows[0];

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: "Error updating product" });
		console.log(err);
		
    }
};
export {
    createProduct,
    createCategory,
    getAllProducts,
    getProductById,
    deleteProduct,
	updateProduct
};
