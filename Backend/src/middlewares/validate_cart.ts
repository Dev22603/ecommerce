import { NextFunction, Request, Response } from "express";
import { validateCartUpdateData } from "../schemas/cart.schemas";
import { ApiError } from "../utils/api_error";

const validateCartUpdate = (req: Request, res: Response, next: NextFunction) => {
	try {
		validateCartUpdateData(req.body);
		next();
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.code).json({ success: false, message: error.message });
		}
		return res.status(400).json({ success: false, message: "Cart validation failed" });
	}
};

export { validateCartUpdate };
