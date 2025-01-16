// routes/authRoutes.js
import express from "express";
import {
	createOrder,
	getUserOrders,
} from "../controllers/order.controller.mjs";
import { authenticate } from "../middlewares/auth.mjs";

const router = express.Router();
// Order routes
router.post("/create", authenticate, createOrder);
router.get("/", authenticate, getUserOrders);

export default router;
