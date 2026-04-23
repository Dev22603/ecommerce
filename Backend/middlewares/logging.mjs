import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warning" : "info";

		logger[level](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
			method: req.method,
			url: req.originalUrl,
			statusCode: res.statusCode,
			duration: `${duration}ms`,
			ip: req.ip,
			userAgent: req.get("user-agent"),
			userId: req.user?.id,
		});
	});

	next();
};

export const errorLogger = (err, req, res, next) => {
	logger.error("Unhandled error", {
		message: err.message,
		stack: err.stack,
		method: req.method,
		url: req.originalUrl,
		ip: req.ip,
		userId: req.user?.id,
	});
	next(err);
};
