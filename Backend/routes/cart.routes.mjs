import express from "express";
import { addItemToCart } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/auth.mjs";

const router = express.Router();

// Add item to cart (protected route)
router.post("/cart", authenticate, addItemToCart);

export default router;
