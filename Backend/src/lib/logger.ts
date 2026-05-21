import { setupLogging, moduleLogger } from "crisplogs";

setupLogging({
	level: "DEBUG",
	style: "short-dynamic",
	datefmt: "%H:%M:%S %d-%m-%Y",
	extraFormat: "inline",
});

export { moduleLogger };
