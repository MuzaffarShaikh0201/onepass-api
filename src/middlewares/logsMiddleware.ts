import morgan from "morgan";
import { Request, Response } from "express";

import logger from "../utils/logger";

const coloredLogsMiddleware = morgan((tokens, req: Request, res: Response) => {
	const status = tokens.status(req, res);
	const method = tokens.method(req, res);
	const url = tokens.url(req, res);
	const responseTime = tokens["response-time"](req, res);

	let logLevel = "info";
	if (typeof status === "number" && status >= 500) {
		logLevel = "error";
	} else if (typeof status === "number" && status >= 400) {
		logLevel = "warn";
	} else if (typeof status === "number" && status >= 300) {
		logLevel = "verbose";
	}

	logger.log({
		level: logLevel,
		message: `[${method}] ${url} ${status} - ${responseTime} ms`,
	});

	return null;
});

export default coloredLogsMiddleware;
