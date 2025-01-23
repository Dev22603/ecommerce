import multer from "multer";
import path from "path";
import { Product, Category } from "../db/db.mjs";
import { Op } from 'sequelize';
// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp";

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(
            new Error("Only .jpeg, .jpg, .png, and .webp files are allowed!"),
            false
        );
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter,
}).array("images", 5); // Limit to 5 images

// Create a product
const createProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading images." });
        }

        try {
            const {
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                tags,
                category_id,
                stock,
            } = req.body;
            const tagsArray = tags.split(",").map((tag) => tag.trim());

            const category = await Category.findByPk(category_id);
            if (!category) {
                return res
                    .status(400)
                    .json({ error: "Category does not exist" });
            }

            const imageURLs = req.files
                ? req.files.map((file) => `/uploads/${file.filename}`)
                : [];

            if (imageURLs.length === 0) {
                return res
                    .status(400)
                    .json({ message: "At least one image is required." });
            }

            const newProduct = await Product.create({
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                images: imageURLs,
                tags: tagsArray,
                category_id,
                stock,
            });

            res.status(201).json({
                message: "Product added successfully",
                data: newProduct,
            });
        } catch (err) {
            console.error(err);
            if (err.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({
                    message:
                        "Product code (ws_code) already exists. Please provide a unique ws_code.",
                });
            }
            res.status(500).json({ message: "Error creating product", err });
        }
    });
};

// Get all products
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await Product.findAndCountAll({
            limit,
            offset,
        });

        res.status(200).json({
            products: result.rows,
            totalCount: result.count,
            page,
            limit,
            totalPages: Math.ceil(result.count / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching products" });
    }
};

// Get product by id
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: "Error fetching product" });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    const { category_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await Product.findAndCountAll({
            where: { category_id },
            limit,
            offset,
        });

        res.status(200).json({
            products: result.rows,
            totalCount: result.count,
            page,
            limit,
            totalPages: Math.ceil(result.count / limit),
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching products by category" });
    }
};

// Get products by name
const getProductsByName = async (req, res) => {
    const { product_name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await Product.findAndCountAll({
            where: {
                product_name: {
                    [Op.iLike]: `%${product_name}%`,
                },
            },
            limit,
            offset,
        });

        res.status(200).json({
            products: result.rows,
            totalCount: result.count,
            page,
            limit,
            totalPages: Math.ceil(result.count / limit),
        });
    } catch (err) {
        
        res.status(500).json({ error: "Error fetching products by name" });
    }
};

// Get products by ws_code
const getProductsByWsCode = async (req, res) => {
    const { ws_code } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    try {
        const result = await Product.findAndCountAll({
            where: {
                [Op.like]: {
                    [Op.col]: `CAST(Product.ws_code AS text)`,
                    [Op.like]: `%${ws_code}%`,
                },
            }, 
            limit,
            offset,
        });
        
        res.status(200).json({
            products: result.rows,
            totalCount: result.count,
            page,
            limit,
            totalPages: Math.ceil(result.count / limit),
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({ error: "Error fetching products by ws_code" });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
        const categoryExists = await Category.findOne({
            where: { category_name: category_name.toLowerCase() },
        });
        if (categoryExists) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const newCategory = await Category.create({ category_name });
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ error: "Error creating category" });
    }
};

// Update product
const updateProduct = async (req, res) => {
    const { id } = req.params;

    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading images." });
        }

        try {
            const {
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                tags,
                category_id,
                stock,
            } = req.body;
            const tagsArray = tags.split(",").map((tag) => tag.trim());

            const images = req.files
                ? req.files.map((file) => `/uploads/${file.filename}`)
                : [];

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            await product.update({
                product_name,
                ws_code,
                sales_price,
                mrp,
                package_size,
                images,
                tags: tagsArray,
                category_id,
                stock,
            });

            res.status(200).json(product);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error updating product" });
        }
    });
};

// Delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await product.destroy();
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
    }
};
const getCategories = async (req, res) => {
    try {
        // Fetch all categories using Sequelize
        const categories = await Category.findAll();

        // Send the response with the categories data
        res.status(200).json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching categories" });
    }
};

export {
    createProduct,
    createCategory,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    getProductsByName,
    getProductsByWsCode,
    getCategories,
    getProductsByCategory,
};
