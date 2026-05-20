import { setupLogging, getLogger } from "crisplogs";

setupLogging({
	level: "DEBUG",
	style: "short-dynamic",
	datefmt: "%H:%M:%S %d-%m-%Y",
	extraFormat: "inline",
});

const logger = getLogger("app");

export { getLogger };
export default logger;
