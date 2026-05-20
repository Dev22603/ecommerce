import { Request, Response } from "express";
import { cartService } from "../services/cart.services";
import { ApiError } from "../utils/api_error";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";
import { getLogger } from "../lib/logger";

const logger = getLogger("cart.controller");

const handleError = (res: Response, error: unknown) => {
	if (error instanceof ApiError) return res.status(error.code).json({ message: error.message });
	logger.error("Cart unexpected error", { error: (error as Error).message, stack: (error as Error).stack });
	return res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
};

const addItemToCart = async (req: Request, res: Response) => {
	try {
		const result = await cartService.addItemToCart(req.user.id, req.body);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const getCart = async (req: Request, res: Response) => {
	try {
		const result = await cartService.getCart(req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const updateCart = async (req: Request, res: Response) => {
	try {
		const result = await cartService.updateCart(req.user.id, req.body);
		return res.status(result.status).json(result.body);
	} catch (error) {
		return handleError(res, error);
	}
};

const removeItemFromCart = async (req: Request, res: Response) => {
	try {
		const productId = Number(req.params.product_id);
		if (Number.isNaN(productId)) return res.status(400).json({ error: "product_id is an integer" });
		const result = await cartService.removeItemFromCart(req.user.id, productId);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

const clearCart = async (req: Request, res: Response) => {
	try {
		const result = await cartService.clearCart(req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		return handleError(res, error);
	}
};

export { getCart, updateCart, removeItemFromCart, addItemToCart, clearCart };
