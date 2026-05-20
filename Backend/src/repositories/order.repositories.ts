import { prisma } from "../lib/prisma";
import { ORDER_STATUS } from "../constants/app.constants";
import { mapOrder, toNumber } from "../utils/mappers";
import { getLogger } from "../lib/logger";

const logger = getLogger("order.repository");

const orderInclude = {
	orderItems: {
		include: {
			product: true,
		},
	},
};

export const orderRepository = {
	async createFromCart(userId: number, addressId: number) {
		try {
			return await prisma.$transaction(async (tx) => {
				const cartItems = await tx.cart.findMany({ where: { userId }, include: { product: true } });
				if (cartItems.length === 0) return { kind: "cart_empty" as const };

				const insufficientStock = cartItems.find((item) => item.product.stock < item.quantity);
				if (insufficientStock) {
					return {
						kind: "insufficient_stock" as const,
						productName: insufficientStock.product.productName,
						available: insufficientStock.product.stock,
						required: insufficientStock.quantity,
					};
				}

				const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.product.salesPrice, 0);
				const order = await tx.order.create({
					data: {
						userId,
						addressId,
						totalAmount,
						orderItems: {
							create: cartItems.map((item) => ({
								productId: item.productId,
								quantity: item.quantity,
								price: item.product.salesPrice,
							})),
						},
					},
				});

				for (const item of cartItems) {
					await tx.product.update({
						where: { id: item.productId },
						data: { stock: { decrement: item.quantity } },
					});
				}

				await tx.cart.deleteMany({ where: { userId } });
				return { kind: "created" as const, orderId: order.id };
			});
		} catch (error) {
			logger.error("DB error - createOrderFromCart", { userId, addressId, error: (error as Error).message });
			throw error;
		}
	},

	async findUserOrders(userId: number, limit: number, offset: number) {
		try {
			const [orders, totalCount] = await prisma.$transaction([
				prisma.order.findMany({ where: { userId }, include: orderInclude, take: limit, skip: offset, orderBy: { createdAt: "desc" } }),
				prisma.order.count({ where: { userId } }),
			]);
			return { orders: orders.map(mapOrder), totalCount };
		} catch (error) {
			logger.error("DB error - findUserOrders", { userId, limit, offset, error: (error as Error).message });
			throw error;
		}
	},

	async findDetails(orderId: number) {
		try {
			const order = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
			return order ? mapOrder(order) : null;
		} catch (error) {
			logger.error("DB error - findOrderDetails", { orderId, error: (error as Error).message });
			throw error;
		}
	},

	async getStatus(orderId: number) {
		try {
			const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
			return order?.status ?? null;
		} catch (error) {
			logger.error("DB error - getOrderStatus", { orderId, error: (error as Error).message });
			throw error;
		}
	},

	async updateStatus(orderId: number, status: ORDER_STATUS) {
		try {
			return await prisma.order.update({ where: { id: orderId }, data: { status } }).catch(() => null);
		} catch (error) {
			logger.error("DB error - updateOrderStatus", { orderId, status, error: (error as Error).message });
			throw error;
		}
	},

	async findAllGroupedByUser(limit: number, offset: number) {
		try {
			const [users, totalOrders] = await prisma.$transaction([
				prisma.user.findMany({
					where: { orders: { some: {} } },
					take: limit,
					skip: offset,
					orderBy: { name: "asc" },
					include: {
						orders: {
							include: orderInclude,
							orderBy: { createdAt: "desc" },
						},
					},
				}),
				prisma.order.count(),
			]);

			const mappedUsers = users.map((user) => ({
				user_id: user.id,
				user_name: user.name,
				orders: user.orders.map((order) => ({
					order_id: order.id,
					total_amount: toNumber(order.totalAmount),
					created_at: order.createdAt,
					status: order.status,
					order_items: order.orderItems.map((item) => ({
						product_id: item.productId,
						product_name: item.product.productName,
						quantity: item.quantity,
						sales_price: toNumber(item.price),
						total_price: item.quantity * Number(toNumber(item.price) ?? 0),
					})),
				})),
			}));

			return { users: mappedUsers, totalOrders };
		} catch (error) {
			logger.error("DB error - findAllOrdersGroupedByUser", { limit, offset, error: (error as Error).message });
			throw error;
		}
	},
};
