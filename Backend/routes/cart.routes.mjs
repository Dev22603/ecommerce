// routes/cart.routes.mjs
import express from "express";
import {
    addItemToCart,
    checkCartItemQuantity,
    clearCart,
    getCart,
    removeItemFromCart,
    updateCart,
} from "../controllers/cart.controllers.mjs";
import { authenticate } from "../middlewares/auth.mjs";
import { validateCartUpdate } from "../middlewares/validate_cart.mjs";

const router = express.Router();

// Add item to cart (protected route)
router.post("/add", authenticate, addItemToCart);
router.get("/", authenticate, getCart);
router.put("/update", authenticate, validateCartUpdate, updateCart);
router.delete("/remove/:product_id", authenticate, removeItemFromCart);
router.post("/check-quantity", authenticate, checkCartItemQuantity); // Route to check the quantity of a specific product in the user's cart
router.delete("/clear", authenticate, clearCart); // Route to clear all items from the user's cart

export default router;
