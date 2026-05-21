import { addressRepository } from "../repositories/address.repositories";
import { orderRepository } from "../repositories/order.repositories";
import { validateCreateOrder, validateOrderStatus } from "../schemas/order.schemas";
import { ORDER_STATUS } from "../constants/app.constants";
import { ORDER_FEEDBACK_MESSAGES, ORDER_VALIDATION_ERRORS } from "../constants/app.messages";
import { ApiError } from "../utils/api_error";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

export const orderService = {
	async createOrder(userId: number, data: unknown) {
		try {
			const { address_id } = validateCreateOrder(data);
			const address = await addressRepository.findRawById(address_id);
			if (!address || address.isDeleted || address.userId !== userId) {
				throw new ApiError(address ? 403 : 404, ORDER_VALIDATION_ERRORS.ADDRESS_ID_NOT_FOUND);
			}

			const result = await orderRepository.createFromCart(userId, address_id);
			if (result.kind === "cart_empty") throw new ApiError(400, ORDER_VALIDATION_ERRORS.CART_EMPTY);
			if (result.kind === "insufficient_stock") {
				throw new ApiError(400, `Insufficient stock for product: ${result.productName}. Available: ${result.available}, Required: ${result.required}`);
			}
			return { message: ORDER_FEEDBACK_MESSAGES.ORDER_CREATED_SUCCESS, order_id: result.orderId };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Create order failed", { userId, addressId: (data as any)?.address_id, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async getUserOrders(userId: number, page: number, limit: number, offset: number) {
		try {
			const { orders, totalCount } = await orderRepository.findUserOrders(userId, limit, offset);
			return {
				page,
				limit,
				total_count: totalCount,
				total_pages: Math.ceil(totalCount / limit),
				orders,
			};
		} catch (error) {
			logger.error("Get user orders failed", { userId, page, limit, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async getOrderDetails(orderId: number) {
		try {
			const order = await orderRepository.findDetails(orderId);
			if (!order) throw new ApiError(404, "Order not found");
			return order;
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Get order details failed", { orderId, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async cancelOrder(orderId: number) {
		try {
			const status = await orderRepository.getStatus(orderId);
			if (!status) throw new ApiError(404, ORDER_FEEDBACK_MESSAGES.ORDER_NOT_FOUND);
			if (status !== ORDER_STATUS.PENDING) {
				throw new ApiError(400, `Cannot cancel order that is not ${ORDER_STATUS.PENDING.toLowerCase()}.`);
			}
			await orderRepository.updateStatus(orderId, ORDER_STATUS.CANCELLED);
			return { message: ORDER_FEEDBACK_MESSAGES.ORDER_CANCELLED_SUCCESS, order_id: orderId };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Cancel order failed", { orderId, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async updateOrderStatus(orderId: number, data: unknown) {
		try {
			const { status } = validateOrderStatus(data) as { status: ORDER_STATUS };
			const order = await orderRepository.updateStatus(orderId, status);
			if (!order) throw new ApiError(404, "Order not found");
			return { message: "Order status updated successfully", order };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Update order status failed", { orderId, status: (data as any)?.status, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async getAllOrders(page: number, limit: number, offset: number) {
		try {
			const { users, totalOrders } = await orderRepository.findAllGroupedByUser(limit, offset);
			if (users.length === 0) throw new ApiError(404, ORDER_FEEDBACK_MESSAGES.NO_ORDERS_FOUND_ADMIN);
			return {
				page,
				limit,
				totalOrders,
				totalPages: Math.ceil(totalOrders / limit),
				users,
			};
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Get all orders failed", { page, limit, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},
};
