import { cartRepository } from "../repositories/cart.repositories";
import { productRepository } from "../repositories/product.repositories";
import { validateCartAddData, validateCartUpdateData } from "../schemas/cart.schemas";
import { ApiError } from "../utils/api_error";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

const mapCartItem = (item: any) => ({
	quantity: item.quantity,
	product_name: item.product.productName,
	product_id: item.product.id,
	images: item.product.images,
	sales_price: item.product.salesPrice,
	total_price_per_item: item.quantity * item.product.salesPrice,
});

export const cartService = {
	async addItemToCart(userId: number, data: unknown) {
		try {
			const { product_id } = validateCartAddData(data);
			const product = await productRepository.findRawById(product_id);
			if (!product) throw new ApiError(404, "Product not available");
			if (product.stock === 0) throw new ApiError(400, "Product is out of stock");
			await cartRepository.addItem(userId, product_id);
			logger.info("Cart item added", { userId, productId: product_id });
			return { message: "Product added to cart successfully" };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Add item to cart failed", { code: error.code, message: error.message, userId, productId: (data as { product_id?: number })?.product_id });
				throw error;
			}
			logger.error("Add item to cart failed", { userId, productId: (data as { product_id?: number })?.product_id, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async getCart(userId: number) {
		try {
			const cart = await cartRepository.findByUser(userId);
			const items = cart.map(mapCartItem);
			const { total_amount, total_quantity } = items.reduce(
				(accum, item) => ({
					total_amount: accum.total_amount + item.total_price_per_item,
					total_quantity: accum.total_quantity + item.quantity,
				}),
				{ total_amount: 0, total_quantity: 0 },
			);
			return { items, total_amount, total_quantity };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Get cart failed", { userId, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},

	async updateCart(userId: number, data: unknown) {
		try {
			const { product_id, quantity } = validateCartUpdateData(data);
			const product = await productRepository.findRawById(product_id);
			if (!product) throw new ApiError(404, "Product not available");
			if (product.stock === 0) throw new ApiError(400, "Product is out of stock");
			if (product.stock < quantity) {
				logger.warn("Cart update — insufficient stock", { userId, productId: product_id, stockAvailable: product.stock, requested: quantity });
				return { status: 400, body: { message: "Not enough stock available", stock_available: product.stock } };
			}

			if (quantity === 0) {
				const deleted = await cartRepository.deleteItem(userId, product_id);
				if (!deleted) {
					logger.warn("Cart update — item not in cart", { userId, productId: product_id });
					return { status: 404, body: { success: false, message: "Product not found in the cart" } };
				}
				logger.info("Cart item removed via update", { userId, productId: product_id });
				return { status: 200, body: { success: true, message: `${product.productName} has been removed from your cart.` } };
			}

			const updatedItem = await cartRepository.updateItem(userId, product_id, quantity);
			if (!updatedItem) {
				logger.warn("Cart update — cart item not found", { userId, productId: product_id });
				return { status: 404, body: { success: false, message: "Cart item not found. The product may not be in your cart." } };
			}
			logger.info("Cart updated", { userId, productId: product_id, quantity });
			return {
				status: 200,
				body: {
					success: true,
					message: "Cart updated successfully",
					data: {
						product_id: updatedItem.productId,
						quantity: updatedItem.quantity,
						product_name: product.productName,
					},
				},
			};
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Update cart failed", { code: error.code, message: error.message, userId, productId: (data as { product_id?: number })?.product_id });
				throw error;
			}
			logger.error("Update cart failed", { userId, productId: (data as { product_id?: number })?.product_id, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async removeItemFromCart(userId: number, productId: number) {
		try {
			const deleted = await cartRepository.deleteItem(userId, productId);
			if (!deleted) throw new ApiError(404, "Product not found in the cart");
			const product = await productRepository.findRawById(productId);
			logger.info("Cart item removed", { userId, productId });
			return { message: `${product?.productName ?? "Product"} has been removed from your cart.` };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Remove item from cart failed", { code: error.code, message: error.message, userId, productId });
				throw error;
			}
			logger.error("Remove item from cart failed", { userId, productId, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async clearCart(userId: number) {
		try {
			await cartRepository.clearByUser(userId);
			logger.info("Cart cleared", { userId });
			return { message: "Cart has been cleared." };
		} catch (error) {
			if (!(error instanceof ApiError)) {
				logger.error("Clear cart failed", { userId, error: (error as Error).message, stack: (error as Error).stack });
			}
			throw error;
		}
	},
};
