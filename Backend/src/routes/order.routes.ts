import express from "express";
import { cancelOrder, createOrder, getAllOrders, getOrderDetails, getUserOrders, updateOrderStatus } from "../controllers/order.controllers";
import { authenticate, authorize } from "../middlewares/auth";
import { ROLES } from "../constants/app.constants";

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.get("/", authenticate, getUserOrders);
router.get("/admin/all", authenticate, authorize([ROLES.ADMIN]), getAllOrders);
router.get("/:order_id", authenticate, getOrderDetails);
router.put("/:order_id", authenticate, cancelOrder);
router.patch("/:order_id/status", authenticate, authorize([ROLES.ADMIN]), updateOrderStatus);

export default router;
