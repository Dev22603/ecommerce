import * as z from "zod/v4";
import { ORDER_STATUS_VALUES } from "../constants/app.constants";
import { ApiError } from "../utils/api_error";
import { trimStrings } from "../utils/common_functions";

const CreateOrderSchema = z.object({
	address_id: z.coerce.number().int().min(1),
});

const UpdateOrderStatusSchema = z.object({
	status: z.enum(ORDER_STATUS_VALUES as [string, ...string[]]),
});

const validateCreateOrder = (data: unknown) => {
	const result = CreateOrderSchema.safeParse(trimStrings(data));
	if (!result.success) throw new ApiError(400, "Address ID is required.");
	return result.data;
};

const validateOrderStatus = (data: unknown) => {
	const result = UpdateOrderStatusSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, `Invalid status. Allowed values are: ${ORDER_STATUS_VALUES.join(", ")}.`);
	}
	return result.data;
};

export { validateCreateOrder, validateOrderStatus };
