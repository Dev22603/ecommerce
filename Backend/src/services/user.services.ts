import { userRepository } from "../repositories/user.repositories";
import { getLogger } from "../lib/logger";

const logger = getLogger("user.service");

export const userService = {
	async getAllUsers() {
		try {
			return await userRepository.findAll();
		} catch (error) {
			logger.error("Get all users failed", { error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},
};
