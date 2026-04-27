import { userRepository } from "../repositories/user.repositories";

export const userService = {
	async getAllUsers() {
		return await userRepository.findAll();
	},
};
