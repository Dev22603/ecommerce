import { app } from "./app";
import { config } from "./constants/config";
import { moduleLogger } from "./lib/logger";

const logger = moduleLogger();

app.listen(config.PORT, () => {
	logger.info(`Server is running on http://localhost:${config.PORT}`);
});
