import { addressRepository } from "../repositories/address.repositories";
import { orderRepository } from "../repositories/order.repositories";
import { validateCreateOrder, validateOrderStatus } from "../schemas/order.schemas";
import { ORDER_STATUS } from "../constants/app.constants";
import { ORDER_FEEDBACK_MESSAGES, ORDER_VALIDATION_ERRORS } from "../constants/app.messages";
import { ApiError } from "../utils/api_error";

export const orderService = {
	async createOrder(userId: number, data: unknown) {
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
	},

	async getUserOrders(userId: number, page: number, limit: number, offset: number) {
		const { orders, totalCount } = await orderRepository.findUserOrders(userId, limit, offset);
		return {
			page,
			limit,
			total_count: totalCount,
			total_pages: Math.ceil(totalCount / limit),
			orders,
		};
	},

	async getOrderDetails(orderId: number) {
		const order = await orderRepository.findDetails(orderId);
		if (!order) throw new ApiError(404, "Order not found");
		return order;
	},

	async cancelOrder(orderId: number) {
		const status = await orderRepository.getStatus(orderId);
		if (!status) throw new ApiError(404, ORDER_FEEDBACK_MESSAGES.ORDER_NOT_FOUND);
		if (status !== ORDER_STATUS.PENDING) {
			throw new ApiError(400, `Cannot cancel order that is not ${ORDER_STATUS.PENDING.toLowerCase()}.`);
		}
		await orderRepository.updateStatus(orderId, ORDER_STATUS.CANCELLED);
		return { message: ORDER_FEEDBACK_MESSAGES.ORDER_CANCELLED_SUCCESS, order_id: orderId };
	},

	async updateOrderStatus(orderId: number, data: unknown) {
		const { status } = validateOrderStatus(data) as { status: ORDER_STATUS };
		const order = await orderRepository.updateStatus(orderId, status);
		if (!order) throw new ApiError(404, "Order not found");
		return { message: "Order status updated successfully", order };
	},

	async getAllOrders(page: number, limit: number, offset: number) {
		const { users, totalOrders } = await orderRepository.findAllGroupedByUser(limit, offset);
		if (users.length === 0) throw new ApiError(404, ORDER_FEEDBACK_MESSAGES.NO_ORDERS_FOUND_ADMIN);
		return {
			page,
			limit,
			totalOrders,
			totalPages: Math.ceil(totalOrders / limit),
			users,
		};
	},
};
