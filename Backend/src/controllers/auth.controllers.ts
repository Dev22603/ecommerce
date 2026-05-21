import { Request, Response } from "express";
import { authService } from "../services/auth.services";
import { ApiError } from "../utils/api_error";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

const signup = async (req: Request, res: Response) => {
	try {
		const result = await authService.signup(req.body);
		res.status(201).json(result);
	} catch (error) {
		if (error instanceof ApiError) return res.status(error.code).json(error.errors.length ? { message: error.message, errors: error.errors } : { error: error.message });
		logger.error("Signup unexpected error", { error: (error as Error).message });
		res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
	}
};

const login = async (req: Request, res: Response) => {
	try {
		const result = await authService.login(req.body);
		res.status(200).json(result);
	} catch (error) {
		if (error instanceof ApiError) return res.status(error.code).json({ error: error.message });
		logger.error("Login unexpected error", { error: (error as Error).message });
		res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
	}
};

export { signup, login };
