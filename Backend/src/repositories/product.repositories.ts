import { prisma } from "../lib/prisma";
import { mapProduct } from "../utils/mappers";

export const productRepository = {
	async create(data: { product_name: string; sales_price: number; mrp: number; images: string[]; category_id: number; stock: number }) {
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
	},

	async findById(id: number) {
		const product = await prisma.product.findUnique({ where: { id } });
		return product ? mapProduct(product) : null;
	},

	async findRawById(id: number, tx: any = prisma) {
		return await tx.product.findUnique({ where: { id } });
	},

	async findPaginated(limit: number, offset: number) {
		const [products, totalCount] = await prisma.$transaction([
			prisma.product.findMany({ take: limit, skip: offset, orderBy: { id: "asc" } }),
			prisma.product.count(),
		]);
		return { products: products.map(mapProduct), totalCount };
	},

	async searchByName(productName: string, limit: number, offset: number) {
		const where = { productName: { contains: productName, mode: "insensitive" as const } };
		const [products, totalCount] = await prisma.$transaction([
			prisma.product.findMany({ where, take: limit, skip: offset, orderBy: { id: "asc" } }),
			prisma.product.count({ where }),
		]);
		return { products: products.map(mapProduct), totalCount };
	},

	async findByCategory(categoryId: number, limit: number, offset: number) {
		const where = { categoryId };
		const [products, totalCount] = await prisma.$transaction([
			prisma.product.findMany({ where, take: limit, skip: offset, orderBy: { id: "asc" } }),
			prisma.product.count({ where }),
		]);
		return { products: products.map(mapProduct), totalCount };
	},

	async delete(id: number) {
		const product = await prisma.product.delete({ where: { id } }).catch(() => null);
		return product ? mapProduct(product) : null;
	},

	async update(id: number, data: Partial<{ product_name: string; sales_price: number; mrp: number; category_id: number; stock: number; images: string[] }>) {
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
	},
};
