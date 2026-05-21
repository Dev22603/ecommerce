import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repositories";
import { validateUserLogin, validateUserSignup } from "../schemas/user.schemas";
import { ApiError } from "../utils/api_error";
import { ROLES } from "../constants/app.constants";
import { USER_FEEDBACK_MESSAGES } from "../constants/app.messages";
import { config } from "../constants/config";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

export const authService = {
	async signup(data: unknown) {
		try {
			const parsedBody = validateUserSignup(data);

			const userExists = await userRepository.existsByEmail(parsedBody.email);
			if (userExists) {
				throw new ApiError(400, USER_FEEDBACK_MESSAGES.USER_ALREADY_EXISTS);
			}

			const role = parsedBody.email.endsWith("@google.com") ? ROLES.ADMIN : ROLES.CUSTOMER;
			const hashedPassword = await bcrypt.hash(parsedBody.password, 10);

			const user = await userRepository.create({
				name: parsedBody.name,
				email: parsedBody.email,
				password: hashedPassword,
				role,
			});
			logger.info("User signed up", { userId: user.id, email: parsedBody.email, role });
			return user;
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Signup failed", { code: error.code, message: error.message, email: (data as { email?: string })?.email });
				throw error;
			}
			logger.error("Signup failed", { email: (data as { email?: string })?.email, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},

	async login(data: unknown) {
		try {
			const credentials = validateUserLogin(data);
			const user = await userRepository.findByEmail(credentials.email);
			if (!user) {
				throw new ApiError(400, USER_FEEDBACK_MESSAGES.USER_NOT_FOUND);
			}

			const isMatch = await bcrypt.compare(credentials.password, user.password);
			if (!isMatch) {
				throw new ApiError(400, USER_FEEDBACK_MESSAGES.INVALID_CREDENTIALS);
			}

			const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, config.JWT_SECRET, { expiresIn: "10h" });
			logger.info("User logged in", { userId: user.id, role: user.role });
			return { token, role: user.role, name: user.name };
		} catch (error) {
			if (error instanceof ApiError) {
				logger.warn("Login failed", { code: error.code, message: error.message, email: (data as { email?: string })?.email });
				throw error;
			}
			logger.error("Login failed", { email: (data as { email?: string })?.email, error: (error as Error).message, stack: (error as Error).stack });
			throw error;
		}
	},
};
