import { prisma } from "../lib/prisma";
import { mapProduct } from "../utils/mappers";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

export const productRepository = {
	async create(data: { product_name: string; sales_price: number; mrp: number; images: string[]; category_id: number; stock: number }) {
		try {
			const product = await prisma.product.create({
				data: {
					productName: data.product_name,
					salesPrice: data.sales_price,
					mrp: data.mrp,
					images: data.images,
					categoryId: data.category_id,
					stock: data.stock,
				},
			});
			return mapProduct(product);
		} catch (error) {
			logger.error("DB error - createProduct", { product: data.product_name, error: (error as Error).message });
			throw error;
		}
	},

	async findById(id: number) {
		try {
			const product = await prisma.product.findUnique({ where: { id } });
			return product ? mapProduct(product) : null;
		} catch (error) {
			logger.error("DB error - findProductById", { id, error: (error as Error).message });
			throw error;
		}
	},

	async findRawById(id: number, tx: any = prisma) {
		try {
			return await tx.product.findUnique({ where: { id } });
		} catch (error) {
			logger.error("DB error - findRawProductById", { id, error: (error as Error).message });
			throw error;
		}
	},

	async findPaginated(limit: number, offset: number) {
		try {
			const [products, totalCount] = await prisma.$transaction([
				prisma.product.findMany({ take: limit, skip: offset, orderBy: { id: "asc" } }),
				prisma.product.count(),
			]);
			return { products: products.map(mapProduct), totalCount };
		} catch (error) {
			logger.error("DB error - findPaginatedProducts", { limit, offset, error: (error as Error).message });
			throw error;
		}
	},

	async searchByName(productName: string, limit: number, offset: number) {
		try {
			const where = { productName: { contains: productName, mode: "insensitive" as const } };
			const [products, totalCount] = await prisma.$transaction([
				prisma.product.findMany({ where, take: limit, skip: offset, orderBy: { id: "asc" } }),
				prisma.product.count({ where }),
			]);
			return { products: products.map(mapProduct), totalCount };
		} catch (error) {
			logger.error("DB error - searchProductsByName", { productName, limit, offset, error: (error as Error).message });
			throw error;
		}
	},

	async findByCategory(categoryId: number, limit: number, offset: number) {
		try {
			const where = { categoryId };
			const [products, totalCount] = await prisma.$transaction([
				prisma.product.findMany({ where, take: limit, skip: offset, orderBy: { id: "asc" } }),
				prisma.product.count({ where }),
			]);
			return { products: products.map(mapProduct), totalCount };
		} catch (error) {
			logger.error("DB error - findProductsByCategory", { categoryId, limit, offset, error: (error as Error).message });
			throw error;
		}
	},

	async delete(id: number) {
		try {
			const product = await prisma.product.delete({ where: { id } }).catch(() => null);
			return product ? mapProduct(product) : null;
		} catch (error) {
			logger.error("DB error - deleteProduct", { id, error: (error as Error).message });
			throw error;
		}
	},

	async update(id: number, data: Partial<{ product_name: string; sales_price: number; mrp: number; category_id: number; stock: number; images: string[] }>) {
		try {
			const product = await prisma.product.update({
				where: { id },
				data: {
					...(data.product_name !== undefined && { productName: data.product_name }),
					...(data.sales_price !== undefined && { salesPrice: data.sales_price }),
					...(data.mrp !== undefined && { mrp: data.mrp }),
					...(data.category_id !== undefined && { categoryId: data.category_id }),
					...(data.stock !== undefined && { stock: data.stock }),
					...(data.images !== undefined && { images: data.images }),
				},
			});
			return mapProduct(product);
		} catch (error) {
			logger.error("DB error - updateProduct", { id, error: (error as Error).message });
			throw error;
		}
	},
};
