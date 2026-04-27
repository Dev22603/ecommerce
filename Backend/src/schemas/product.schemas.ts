import * as z from "zod/v4";
import { PRODUCT_VALIDATION_ERRORS } from "../constants/app.messages";
import { ApiError } from "../utils/api_error";
import { trimStrings } from "../utils/common_functions";

const ProductSchema = z.object({
	product_name: z.string().min(1, PRODUCT_VALIDATION_ERRORS.NAME_REQUIRED),
	sales_price: z.coerce.number(PRODUCT_VALIDATION_ERRORS.SALES_PRICE_INVALID).min(1, PRODUCT_VALIDATION_ERRORS.SALES_PRICE_MIN),
	mrp: z.coerce.number(PRODUCT_VALIDATION_ERRORS.MRP_INVALID).min(1, PRODUCT_VALIDATION_ERRORS.MRP_MIN),
	category_id: z.coerce.number(PRODUCT_VALIDATION_ERRORS.CATEGORY_ID_INVALID).int().min(1, PRODUCT_VALIDATION_ERRORS.CATEGORY_ID_MIN),
	stock: z.coerce.number(PRODUCT_VALIDATION_ERRORS.STOCK_INVALID).int().min(0, PRODUCT_VALIDATION_ERRORS.STOCK_MIN),
});

const ProductUpdateSchema = ProductSchema.partial();

const validateProduct = (data: unknown) => {
	const result = ProductSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, "Validation failed", result.error.issues.map((issue) => issue.message));
	}
	if (result.data.sales_price > result.data.mrp) {
		throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.SALES_PRICE_GREATER_THAN_MRP);
	}
	return result.data;
};

const validateProductUpdate = (data: unknown) => {
	const result = ProductUpdateSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, "Validation failed", result.error.issues.map((issue) => issue.message));
	}
	if (result.data.sales_price !== undefined && result.data.mrp !== undefined && result.data.sales_price > result.data.mrp) {
		throw new ApiError(400, PRODUCT_VALIDATION_ERRORS.SALES_PRICE_GREATER_THAN_MRP);
	}
	return result.data;
};

export { validateProduct, validateProductUpdate };
