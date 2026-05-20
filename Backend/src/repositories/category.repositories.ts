import { prisma } from "../lib/prisma";
import { mapCategory } from "../utils/mappers";
import { getLogger } from "../lib/logger";

const logger = getLogger("category.repository");

export const categoryRepository = {
	async existsById(id: number) {
		try {
			const category = await prisma.category.findUnique({ where: { id } });
			return !!category;
		} catch (error) {
			logger.error("DB error - existsCategoryById", { id, error: (error as Error).message });
			throw error;
		}
	},

	async existsByName(categoryName: string) {
		try {
			const category = await prisma.category.findFirst({ where: { categoryName } });
			return !!category;
		} catch (error) {
			logger.error("DB error - existsCategoryByName", { categoryName, error: (error as Error).message });
			throw error;
		}
	},

	async create(categoryName: string) {
		try {
			const category = await prisma.category.create({ data: { categoryName } });
			return mapCategory(category);
		} catch (error) {
			logger.error("DB error - createCategory", { categoryName, error: (error as Error).message });
			throw error;
		}
	},

	async findAll() {
		try {
			const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
			return categories.map(mapCategory);
		} catch (error) {
			logger.error("DB error - findAllCategories", { error: (error as Error).message });
			throw error;
		}
	},
};
