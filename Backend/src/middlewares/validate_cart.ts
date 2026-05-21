import { NextFunction, Request, Response } from "express";
import { validateCartUpdateData } from "../schemas/cart.schemas";
import { ApiError } from "../utils/api_error";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

const validateCartUpdate = (req: Request, res: Response, next: NextFunction) => {
	try {
		validateCartUpdateData(req.body);
		next();
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.code).json({ success: false, message: error.message });
		}
		logger.error("Cart validation unexpected error", { error: (error as Error).message, stack: (error as Error).stack });
		return res.status(400).json({ success: false, message: "Cart validation failed" });
	}
};

export { validateCartUpdate };
