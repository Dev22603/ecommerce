import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.mjs";
import { userSchema } from "../utils/validators/user.validator.mjs";
import { AppError } from "../utils/errors/AppError.mjs";
import { USER_FEEDBACK_MESSAGES } from "../utils/constants/app.messages.mjs";

export const userService = {
	signup: async ({ name, email, password }) => {
		const parsedBody = {
			name: name?.trim(),
			email: email?.trim().toLowerCase(),
			password: password?.trim(),
		};

		const { error } = userSchema.validate(parsedBody, { abortEarly: false });
		if (error) {
			const errors = error.details.map((e) => e.message);
			throw new AppError(
				JSON.stringify({ message: "User Validation failed", errors }),
				"VALIDATION_ERROR"
			);
		}

		const userExists = await userRepository.existsByEmail(parsedBody.email);
		if (userExists) {
			throw new AppError(USER_FEEDBACK_MESSAGES.USER_ALREADY_EXISTS, "USER_ALREADY_EXISTS");
		}

		let role = parsedBody.email.endsWith("@google.com") ? "admin" : "customer";
		const hashedPassword = await bcrypt.hash(parsedBody.password, 10);

		const user = await userRepository.create({
			name: parsedBody.name,
			email: parsedBody.email,
			password: hashedPassword,
			role,
		});

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};
	},

	login: async ({ email, password }) => {
		const emailTrimmed = email?.trim().toLowerCase();
		const passwordTrimmed = password?.trim();

		const user = await userRepository.findByEmail(emailTrimmed);
		if (!user) {
			throw new AppError(USER_FEEDBACK_MESSAGES.USER_NOT_FOUND, "USER_NOT_FOUND");
		}

		const isMatch = await bcrypt.compare(passwordTrimmed, user.password);
		if (!isMatch) {
			throw new AppError(USER_FEEDBACK_MESSAGES.INVALID_CREDENTIALS, "INVALID_CREDENTIALS");
		}

		const token = jwt.sign(
			{
				id: user.id,
				role: user.role,
				name: user.name,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "10h",
			}
		);

		return {
			token,
			role: user.role,
			name: user.name,
		};
	},

	getAllUsers: async () => {
		return await userRepository.findAll();
	},
};