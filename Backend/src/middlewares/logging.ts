import { NextFunction, Request, Response } from "express";
import { config } from "../constants/config";
import { moduleLogger } from "../lib/logger";

const logger = moduleLogger();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();

	if (config.LOG_LEVEL === "DEBUG") {
		logger.debug("Request started", {
			method: req.method,
			url: req.originalUrl,
			userId: req.user?.id,
			ip: req.ip,
		});
	}

	res.on("finish", () => {
		const duration = Date.now() - start;
		const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
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
