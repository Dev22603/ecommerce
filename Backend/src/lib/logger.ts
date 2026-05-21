import { setupLogging, moduleLogger } from "crisplogs";
import { config } from "../constants/config";

setupLogging({
	level: config.LOG_LEVEL as "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL",
	style: "short-dynamic",
	datefmt: "%H:%M:%S %d-%m-%Y",
	extraFormat: "inline",
});

export { moduleLogger };
