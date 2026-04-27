import * as z from "zod/v4";
import { CART_VALIDATION_ERRORS } from "../constants/app.messages";
import { ApiError } from "../utils/api_error";
import { trimStrings } from "../utils/common_functions";

const CartUpdateSchema = z.object({
	product_id: z.coerce.number(CART_VALIDATION_ERRORS.PRODUCT_ID_INVALID).int().min(1, CART_VALIDATION_ERRORS.PRODUCT_ID_MIN),
	quantity: z.coerce.number(CART_VALIDATION_ERRORS.QUANTITY_INVALID).int().min(0, CART_VALIDATION_ERRORS.QUANTITY_MIN),
});

const CartAddSchema = z.object({
	product_id: z.coerce.number(CART_VALIDATION_ERRORS.PRODUCT_ID_INVALID).int().min(1, CART_VALIDATION_ERRORS.PRODUCT_ID_MIN),
});

const validateCartUpdateData = (data: unknown) => {
	const result = CartUpdateSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, result.error.issues[0]?.message ?? "Cart validation failed");
	}
	return result.data;
};

const validateCartAddData = (data: unknown) => {
	const result = CartAddSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, result.error.issues[0]?.message ?? "Cart validation failed");
	}
	return result.data;
};

export { validateCartUpdateData, validateCartAddData };
