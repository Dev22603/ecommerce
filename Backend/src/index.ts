import { app } from "./app";
import { config } from "./constants/config";
import { moduleLogger } from "./lib/logger";

const logger = moduleLogger();

process.on("uncaughtException", (error: Error) => {
	logger.critical("Uncaught exception", { error: error.message, stack: error.stack });
	process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
	logger.error("Unhandled promise rejection", {
		error: reason instanceof Error ? reason.message : String(reason),
		stack: reason instanceof Error ? reason.stack : undefined,
	});
});

const server = app.listen(config.PORT, () => {
	logger.info(`Server is running on http://localhost:${config.PORT}`);
});

const shutdown = (signal: string) => {
	logger.warn("Shutdown signal received", { signal });
	server.close(() => {
		logger.info("Server closed");
		process.exit(0);
	});
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
