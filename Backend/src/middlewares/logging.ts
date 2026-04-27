import { NextFunction, Request, Response } from "express";
import logger from "../lib/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();

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
