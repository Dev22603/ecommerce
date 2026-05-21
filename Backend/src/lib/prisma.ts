import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "../constants/config";
import { moduleLogger } from "./logger";

const logger = moduleLogger();

const createPrismaClient = () => {
	try {
		const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
		const adapter = new PrismaPg(pool);

		const prismaLog =
			config.NODE_ENV === "production"
				? (["warn", "error"] as const)
				: config.LOG_LEVEL === "DEBUG"
					? (["query", "info", "warn", "error"] as const)
					: (["warn", "error"] as const);

		return new PrismaClient({
			adapter,
			log: [...prismaLog],
		});
	} catch (error) {
		logger.critical("Failed to create Prisma client", { error: (error as Error).message, stack: (error as Error).stack });
		throw error;
	}
};

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClientSingleton;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (config.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
