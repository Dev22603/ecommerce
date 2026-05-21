import { Request, Response } from "express";
import { orderService } from "../services/order.services";
import { validatePagination } from "../utils/common_functions";
import { ApiError } from "../utils/api_error";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

const handleError = (res: Response, error: unknown) => {
	if (error instanceof ApiError) return res.status(error.code).json({ message: error.message });
	logger.error("Order unexpected error", { error: (error as Error).message, stack: (error as Error).stack });
	return res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
};

const createOrder = async (req: Request, res: Response) => {
	try {
		const result = await orderService.createOrder(req.user.id, req.body);
		return res.status(201).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getUserOrders = async (req: Request, res: Response) => {
	try {
		const { page, limit, offset } = validatePagination(req);
		const result = await orderService.getUserOrders(req.user.id, page, limit, offset);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const parseOrderId = (raw: string) => {
	const orderId = Number(raw);
	if (Number.isNaN(orderId)) {
		logger.warn("Invalid order_id param", { orderId: raw });
		return null;
	}
	return orderId;
};

const getOrderDetails = async (req: Request, res: Response) => {
	try {
		const orderId = parseOrderId(String(req.params.order_id));
		if (orderId === null) return res.status(400).json({ message: "order_id is an integer" });
		const result = await orderService.getOrderDetails(orderId);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const cancelOrder = async (req: Request, res: Response) => {
	try {
		const orderId = parseOrderId(String(req.params.order_id));
		if (orderId === null) return res.status(400).json({ message: "order_id is an integer" });
		const result = await orderService.cancelOrder(orderId);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const orderId = parseOrderId(String(req.params.order_id));
		if (orderId === null) return res.status(400).json({ message: "order_id is an integer" });
		const result = await orderService.updateOrderStatus(orderId, req.body);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getAllOrders = async (req: Request, res: Response) => {
	try {
		const { page, limit, offset } = validatePagination(req);
		const result = await orderService.getAllOrders(page, limit, offset);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

export { createOrder, getUserOrders, getOrderDetails, cancelOrder, updateOrderStatus, getAllOrders };
