import { Request, Response } from "express";
import { orderService } from "../services/order.services";
import { validatePagination } from "../utils/common_functions";
import { ApiError } from "../utils/api_error";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";

const handleError = (res: Response, error: unknown) => {
	if (error instanceof ApiError) return res.status(error.code).json({ message: error.message });
	return res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR, error: (error as Error).message });
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

const getOrderDetails = async (req: Request, res: Response) => {
	try {
		const result = await orderService.getOrderDetails(Number(req.params.order_id));
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const cancelOrder = async (req: Request, res: Response) => {
	try {
		const result = await orderService.cancelOrder(Number(req.params.order_id));
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const result = await orderService.updateOrderStatus(Number(req.params.order_id), req.body);
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
