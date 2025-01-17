// Backend\routes\product.routes.mjs
import express from "express";
import {
    createProduct,
    createCategory,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    getProductsByName,
    getProductsByWsCode,
    getCategories,
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
router.get("/", getAllProducts);
router.get(
    "/id/:id",
    authenticate,
    authorize(["admin", "customer"]),
    getProductById
);
router.get("/categories", authenticate, authorize(["admin"]), getCategories);
router.get("/product_name/:product_name", getProductsByName); //customer end
router.get("/ws_code/:ws_code", getProductsByWsCode); //customer end
router.post("/newCategory", authenticate, authorize(["admin"]), createCategory);

export default router;
