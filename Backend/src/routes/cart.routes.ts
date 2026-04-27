import express from "express";
import { addItemToCart, clearCart, getCart, removeItemFromCart, updateCart } from "../controllers/cart.controllers";
import { authenticate } from "../middlewares/auth";
import { validateCartUpdate } from "../middlewares/validate_cart";

const router = express.Router();

router.post("/add", authenticate, addItemToCart);
router.get("/", authenticate, getCart);
router.put("/update", authenticate, validateCartUpdate, updateCart);
router.delete("/remove/:product_id", authenticate, removeItemFromCart);
router.delete("/clear", authenticate, clearCart);

export default router;
