import { prisma } from "../lib/prisma";

const includeProduct = { product: true };

export const cartRepository = {
	async addItem(userId: number, productId: number) {
		return await prisma.cart.upsert({
			where: { userId_productId: { userId, productId } },
			create: { userId, productId, quantity: 1 },
			update: { quantity: { increment: 1 } },
		});
	},

	async findByUser(userId: number) {
		return await prisma.cart.findMany({ where: { userId }, include: includeProduct, orderBy: { createdAt: "asc" } });
	},

	async updateItem(userId: number, productId: number, quantity: number) {
		return await prisma.cart.update({
			where: { userId_productId: { userId, productId } },
			data: { quantity },
		}).catch(() => null);
	},

	async deleteItem(userId: number, productId: number) {
		return await prisma.cart.delete({ where: { userId_productId: { userId, productId } } }).catch(() => null);
	},

	async clearByUser(userId: number, tx: any = prisma) {
		return await tx.cart.deleteMany({ where: { userId } });
	},
};
