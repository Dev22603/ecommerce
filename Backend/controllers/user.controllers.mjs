import { userService } from "../services/user.service.mjs";
import { AppError, ErrorTypes } from "../utils/errors/AppError.mjs";
import { GLOBAL_ERROR_MESSAGES } from "../utils/constants/app.messages.mjs";

const errorStatusMap = {
	[ErrorTypes.VALIDATION_ERROR]: 400,
	[ErrorTypes.USER_ALREADY_EXISTS]: 400,
	[ErrorTypes.USER_NOT_FOUND]: 400,
	[ErrorTypes.INVALID_CREDENTIALS]: 400,
	[ErrorTypes.SERVER_ERROR]: 500,
};

const signup = async (req, res) => {
	try {
		const result = await userService.signup(req.body);
		res.status(201).json(result);
	} catch (error) {
		const statusCode = errorStatusMap[error.errorType] || 500;
		const parsedError = tryParseJsonError(error.message);
		res.status(statusCode).json(parsedError || { error: error.message });
	}
};

const login = async (req, res) => {
	try {
		const result = await userService.login(req.body);
		res.status(200).json(result);
	} catch (error) {
		const statusCode = errorStatusMap[error.errorType] || 500;
		res.status(statusCode).json({ error: error.message });
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await userService.getAllUsers();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: GLOBAL_ERROR_MESSAGES.SERVER_ERROR });
	}
};

const tryParseJsonError = (message) => {
	try {
		const parsed = JSON.parse(message);
		if (parsed.message) return parsed;
	} catch {}
	return null;
};

export { signup, login, getAllUsers };