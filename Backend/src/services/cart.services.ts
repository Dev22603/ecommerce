import { cartRepository } from "../repositories/cart.repositories";
import { productRepository } from "../repositories/product.repositories";
import { validateCartAddData, validateCartUpdateData } from "../schemas/cart.schemas";
import { ApiError } from "../utils/api_error";

const mapCartItem = (item: any) => ({
	quantity: item.quantity,
	product_name: item.product.productName,
	product_id: item.product.id,
	images: item.product.images,
	sales_price: item.product.salesPrice,
	total_price_per_item: item.quantity * item.product.salesPrice,
	mrp: item.product.mrp,
	stock: item.product.stock,
});

export const cartService = {
	async addItemToCart(userId: number, data: unknown) {
		const { product_id } = validateCartAddData(data);
		const product = await productRepository.findRawById(product_id);
		if (!product) throw new ApiError(404, "Product not available");
		if (product.stock === 0) throw new ApiError(400, "Product is out of stock");
		await cartRepository.addItem(userId, product_id);
		return { message: "Product added to cart successfully" };
	},

	async getCart(userId: number) {
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
	},

	async updateCart(userId: number, data: unknown) {
		const { product_id, quantity } = validateCartUpdateData(data);
		const product = await productRepository.findRawById(product_id);
		if (!product) throw new ApiError(404, "Product not available");
		if (product.stock === 0) throw new ApiError(400, "Product is out of stock");
		if (product.stock < quantity) {
			return { status: 400, body: { message: "Not enough stock available", stock_available: product.stock } };
		}

		if (quantity === 0) {
			const deleted = await cartRepository.deleteItem(userId, product_id);
			if (!deleted) return { status: 404, body: { success: false, message: "Product not found in the cart" } };
			return { status: 200, body: { success: true, message: `${product.productName} has been removed from your cart.` } };
		}

		const updatedItem = await cartRepository.updateItem(userId, product_id, quantity);
		if (!updatedItem) {
			return { status: 404, body: { success: false, message: "Cart item not found. The product may not be in your cart." } };
		}
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
	},

	async removeItemFromCart(userId: number, productId: number) {
		const deleted = await cartRepository.deleteItem(userId, productId);
		if (!deleted) throw new ApiError(404, "Product not found in the cart");
		const product = await productRepository.findRawById(productId);
		return { message: `${product?.productName ?? "Product"} has been removed from your cart.` };
	},

	async clearCart(userId: number) {
		await cartRepository.clearByUser(userId);
		return { message: "Cart has been cleared." };
	},
};
