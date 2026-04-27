import { Request } from "express";
import { LIMITS } from "../constants/app.constants";

const validatePagination = (req: Request) => {
	const { page = LIMITS.PAGE_DEFAULT, limit = LIMITS.LIMIT_DEFAULT } = req.query;
	const validatedPage = Math.max(1, Number.parseInt(String(page), 10) || LIMITS.PAGE_DEFAULT);
	const validatedLimit = Math.max(1, Number.parseInt(String(limit), 10) || LIMITS.LIMIT_DEFAULT);
	const offset = (validatedPage - 1) * validatedLimit;

	return { page: validatedPage, limit: validatedLimit, offset };
};

const formatDate = (dateString: string | Date) => new Date(dateString).toLocaleDateString("en-GB");

const trimStrings = <T>(value: T): T => {
	if (typeof value === "string") return value.trim() as T;
	if (Array.isArray(value)) return value.map((item) => trimStrings(item)) as T;
	if (value && typeof value === "object") {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, trimStrings(entry)])) as T;
	}
	return value;
};

export { validatePagination, formatDate, trimStrings };
