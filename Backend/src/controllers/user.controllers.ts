import { Request, Response } from "express";
import { userService } from "../services/user.services";
import { GLOBAL_ERROR_MESSAGES } from "../constants/app.messages";
import { getLogger } from "../lib/logger";

const logger = getLogger("user.controller");

const getAllUsers = async (_req: Request, res: Response) => {
	try {
		const users = await userService.getAllUsers();
		res.status(200).json(users);
	} catch (error) {
		logger.error("Get all users unexpected error", { error: (error as Error).message });
		res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
	}
};

export { getAllUsers };
