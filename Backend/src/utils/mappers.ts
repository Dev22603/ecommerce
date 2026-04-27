import { Prisma } from "../generated/prisma/client";

const toNumber = (value: Prisma.Decimal | number | string | null | undefined) => {
	if (value === null || value === undefined) return value;
	return Number(value);
};

const mapUser = (user: any) => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role,
	created_at: user.createdAt,
});

const mapCategory = (category: any) => ({
	id: category.id,
	category_name: category.categoryName,
});

const mapProduct = (product: any) => ({
	id: product.id,
	product_name: product.productName,
	sales_price: product.salesPrice,
	mrp: product.mrp,
	images: product.images,
	category_id: product.categoryId,
	stock: product.stock,
});

const mapAddress = (address: any) => ({
	id: address.id,
	user_id: address.userId,
	full_name: address.fullName,
	phone: address.phone,
	pincode: address.pincode,
	house_number: address.houseNumber,
	area: address.area,
	landmark: address.landmark,
	city: address.city,
	state: address.state,
	address_type: address.addressType,
	is_deleted: address.isDeleted,
	is_default: address.isDefault,
	created_at: address.createdAt,
});

const mapOrderItem = (item: any) => ({
	product_id: item.productId,
	product_name: item.product?.productName,
	quantity: item.quantity,
	sales_price: toNumber(item.price),
	mrp: item.product?.mrp,
	images: item.product?.images,
	total_price: Number(item.quantity) * Number(toNumber(item.price) ?? 0),
});

const mapOrder = (order: any) => ({
	order_id: order.id,
	user_id: order.userId,
	total_amount: toNumber(order.totalAmount),
	status: order.status,
	created_at: order.createdAt,
	order_items: order.orderItems?.map(mapOrderItem) ?? [],
});

export { toNumber, mapUser, mapCategory, mapProduct, mapAddress, mapOrderItem, mapOrder };
