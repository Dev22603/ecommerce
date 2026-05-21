import { userRepository } from "../repositories/user.repositories";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

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
