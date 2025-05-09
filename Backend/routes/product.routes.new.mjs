// Backend\routes\product.routes.mjs
import express from "express";
import { createProduct } from "../controllers/product.controller.new.mjs";
import { authenticate, authorize } from "../middlewares/auth.mjs";
import { uploadProductImages } from "../middlewares/uploads.mjs";
const router = express.Router();

router.post(
    "/",
    // authenticate,
    // authorize(["admin"]),
    uploadProductImages,
    createProduct
);
export default router;
