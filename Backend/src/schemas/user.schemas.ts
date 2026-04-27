import * as z from "zod/v4";
import { REGEX, LIMITS } from "../constants/app.constants";
import { USER_VALIDATION_ERRORS } from "../constants/app.messages";
import { ApiError } from "../utils/api_error";
import { trimStrings } from "../utils/common_functions";

const UserSignupSchema = z.object({
	name: z.string().min(LIMITS.NAME_MIN, USER_VALIDATION_ERRORS.NAME_MIN).max(LIMITS.NAME_MAX, USER_VALIDATION_ERRORS.NAME_MAX),
	email: z.string().regex(REGEX.EMAIL, USER_VALIDATION_ERRORS.EMAIL_INVALID).transform((value) => value.toLowerCase()),
	password: z.string().regex(REGEX.PASSWORD, USER_VALIDATION_ERRORS.PASSWORD_INVALID),
});

const UserLoginSchema = z.object({
	email: z.string().regex(REGEX.EMAIL, USER_VALIDATION_ERRORS.EMAIL_INVALID).transform((value) => value.toLowerCase()),
	password: z.string().min(1, USER_VALIDATION_ERRORS.PASSWORD_REQUIRED),
});

const validateUserSignup = (data: unknown) => {
	const result = UserSignupSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, "User Validation failed", result.error.issues.map((issue) => issue.message));
	}
	return result.data;
};

const validateUserLogin = (data: unknown) => {
	const result = UserLoginSchema.safeParse(trimStrings(data));
	if (!result.success) {
		throw new ApiError(400, "User login validation failed", result.error.issues.map((issue) => issue.message));
	}
	return result.data;
};

export { validateUserSignup, validateUserLogin };
