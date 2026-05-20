import { prisma } from "../lib/prisma";
import { getLogger } from "../lib/logger";

const logger = getLogger("cart.repository");

const includeProduct = { product: true };

export const cartRepository = {
	async addItem(userId: number, productId: number) {
		try {
			return await prisma.cart.upsert({
				where: { userId_productId: { userId, productId } },
				create: { userId, productId, quantity: 1 },
				update: { quantity: { increment: 1 } },
			});
		} catch (error) {
			logger.error("DB error - addCartItem", { userId, productId, error: (error as Error).message });
			throw error;
		}
	},

	async findByUser(userId: number) {
		try {
			return await prisma.cart.findMany({ where: { userId }, include: includeProduct, orderBy: { createdAt: "asc" } });
		} catch (error) {
			logger.error("DB error - findCartByUser", { userId, error: (error as Error).message });
			throw error;
		}
	},

	async updateItem(userId: number, productId: number, quantity: number) {
		try {
			return await prisma.cart.update({
				where: { userId_productId: { userId, productId } },
				data: { quantity },
			}).catch(() => null);
		} catch (error) {
			logger.error("DB error - updateCartItem", { userId, productId, quantity, error: (error as Error).message });
			throw error;
		}
	},

	async deleteItem(userId: number, productId: number) {
		try {
			return await prisma.cart.delete({ where: { userId_productId: { userId, productId } } }).catch(() => null);
		} catch (error) {
			logger.error("DB error - deleteCartItem", { userId, productId, error: (error as Error).message });
			throw error;
		}
	},

	async clearByUser(userId: number, tx: any = prisma) {
		try {
			return await tx.cart.deleteMany({ where: { userId } });
		} catch (error) {
			logger.error("DB error - clearCart", { userId, error: (error as Error).message });
			throw error;
		}
	},
};
