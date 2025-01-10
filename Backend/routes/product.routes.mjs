import express from "express";
import {
    createProduct,
    createCategory,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
} from "../controllers/product.controller.mjs";
import { authenticate, authorize } from "../middlewares/auth.mjs";
const router = express.Router();

// router.post("/", createProduct);
// router.get("/", getAllProducts);
// router.get("/:id", getProductById);
// router.delete("/:id", deleteProduct);
// router.put("/:id", updateProduct);
// router.post("/newCategory", createCategory);
router.post("/", authenticate, authorize(["admin"]), createProduct);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);
router.put("/:id", authenticate, authorize(["admin"]), updateProduct);
router.get("/", authenticate, authorize(["admin", "customer"]), getAllProducts);
router.get("/:id", authenticate, authorize(["admin", "customer"]), getProductById);
router.post("/newCategory", authenticate, authorize(["admin"]), createCategory);


export default router;


