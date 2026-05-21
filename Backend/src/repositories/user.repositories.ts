import { prisma } from "../lib/prisma";
import { ROLES } from "../constants/app.constants";
import { moduleLogger } from "../lib/logger";
import { mapUser } from "../utils/mappers";

const logger = moduleLogger();

export const userRepository = {
	async existsByEmail(email: string) {
		try {
			const user = await prisma.user.findUnique({ where: { email } });
			return !!user;
		} catch (error) {
			logger.error("DB error - existsByEmail", { email, error: (error as Error).message });
			throw error;
		}
	},

	async findByEmail(email: string) {
		try {
			return await prisma.user.findUnique({ where: { email } });
		} catch (error) {
			logger.error("DB error - findByEmail", { email, error: (error as Error).message });
			throw error;
		}
	},

	async create(data: { name: string; email: string; password: string; role: ROLES }) {
		try {
			const user = await prisma.user.create({ data });
			return mapUser(user);
		} catch (error) {
			logger.error("DB error - createUser", { email: data.email, error: (error as Error).message });
			throw error;
		}
	},

	async findAll() {
		try {
			const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
			return users.map(mapUser);
		} catch (error) {
			logger.error("DB error - findAllUsers", { error: (error as Error).message });
			throw error;
		}
	},
};
