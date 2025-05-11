// Backend\routes\product.routes.mjs
import express from "express";
import { createProduct } from "../controllers/product.controller.mjs";
import { authenticate, authorize } from "../middlewares/auth.mjs";
import { uploadProductImages } from "../middlewares/uploads.mjs";
import { validateProduct } from "../middlewares/validate_product.mjs";
const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    uploadProductImages,
    validateProduct,
    createProduct
);
export default router;
