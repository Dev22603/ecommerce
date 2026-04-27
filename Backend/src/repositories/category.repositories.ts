import { prisma } from "../lib/prisma";
import { mapCategory } from "../utils/mappers";

export const categoryRepository = {
	async existsById(id: number) {
		const category = await prisma.category.findUnique({ where: { id } });
		return !!category;
	},

	async existsByName(categoryName: string) {
		const category = await prisma.category.findFirst({ where: { categoryName } });
		return !!category;
	},

	async create(categoryName: string) {
		const category = await prisma.category.create({ data: { categoryName } });
		return mapCategory(category);
	},

	async findAll() {
		const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
		return categories.map(mapCategory);
	},
};
