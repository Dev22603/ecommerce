import * as z from "zod/v4";
import { REGEX } from "../constants/app.constants";
import { ADDRESS_VALIDATION_ERRORS } from "../constants/app.messages";
import { ApiError } from "../utils/api_error";
import { trimStrings } from "../utils/common_functions";

const AddressSchema = z.object({
	full_name: z.string().min(2, ADDRESS_VALIDATION_ERRORS.FULL_NAME_MIN),
	phone: z.string().regex(REGEX.PHONE, ADDRESS_VALIDATION_ERRORS.PHONE_INVALID),
	pincode: z.string().regex(REGEX.PINCODE, ADDRESS_VALIDATION_ERRORS.PINCODE_INVALID),
	house_number: z.string().min(1, ADDRESS_VALIDATION_ERRORS.HOUSE_NUMBER_REQUIRED),
	area: z.string().min(1, ADDRESS_VALIDATION_ERRORS.AREA_REQUIRED),
	landmark: z.string().optional().nullable(),
	city: z.string().min(1, ADDRESS_VALIDATION_ERRORS.CITY_REQUIRED),
	state: z.string().min(1, ADDRESS_VALIDATION_ERRORS.STATE_REQUIRED),
	address_type: z.string().min(1, ADDRESS_VALIDATION_ERRORS.ADDRESS_TYPE_REQUIRED).default("Home"),
});

const validateAddress = (data: unknown) => {
	const result = AddressSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, "Validation failed", result.error.issues.map((issue) => issue.message));
	}
	return result.data;
};

export { validateAddress };
