import express from "express";
import {
	createCategory,
	createProduct,
	deleteProduct,
	getAllProducts,
	getCategories,
	getProductById,
	getProductsByCategory,
	searchProductsByName,
	updateProduct,
} from "../controllers/product.controllers";
import { authenticate, authorize } from "../middlewares/auth";
import { uploadProductImages } from "../middlewares/uploads";
import { ROLES } from "../constants/app.constants";

const router = express.Router();

router.post("/", authenticate, authorize([ROLES.ADMIN]), uploadProductImages, createProduct);
router.delete("/:id", authenticate, authorize([ROLES.ADMIN]), deleteProduct);
router.put("/:id", authenticate, authorize([ROLES.ADMIN]), uploadProductImages, updateProduct);
router.post("/new_category", authenticate, authorize([ROLES.ADMIN]), createCategory);

router.get("/id/:id", getProductById);
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/product_name/:product_name", searchProductsByName);
router.get("/category_id/:category_id", getProductsByCategory);

export default router;
