import express from "express";
import {
    createProduct,
    createCategory,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
} from "../controllers/product.controller.mjs";
const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

router.post("/newCategory", createCategory);

export default router;
