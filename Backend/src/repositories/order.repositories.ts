import { prisma } from "../lib/prisma";
import { ORDER_STATUS } from "../constants/app.constants";
import { mapOrder, toNumber } from "../utils/mappers";

const orderInclude = {
	orderItems: {
		include: {
			product: true,
		},
	},
};

export const orderRepository = {
	async createFromCart(userId: number, addressId: number) {
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

			// ⚡ Bolt: Execute independent product stock updates concurrently to prevent event loop blocking in transactions
			await Promise.all(
				cartItems.map((item) =>
					tx.product.update({
						where: { id: item.productId },
						data: { stock: { decrement: item.quantity } },
					})
				)
			);

			await tx.cart.deleteMany({ where: { userId } });
			return { kind: "created" as const, orderId: order.id };
		});
	},

	async findUserOrders(userId: number, limit: number, offset: number) {
		const [orders, totalCount] = await prisma.$transaction([
			prisma.order.findMany({ where: { userId }, include: orderInclude, take: limit, skip: offset, orderBy: { createdAt: "desc" } }),
			prisma.order.count({ where: { userId } }),
		]);
		return { orders: orders.map(mapOrder), totalCount };
	},

	async findDetails(orderId: number) {
		const order = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
		return order ? mapOrder(order) : null;
	},

	async getStatus(orderId: number) {
		const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
		return order?.status ?? null;
	},

	async updateStatus(orderId: number, status: ORDER_STATUS) {
		return await prisma.order.update({ where: { id: orderId }, data: { status } }).catch(() => null);
	},

	async findAllGroupedByUser(limit: number, offset: number) {
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
	},
};
