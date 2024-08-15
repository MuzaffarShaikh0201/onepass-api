import { Request, Response, Router } from "express";

import logger from "../utils/logger";
import { generateRegistrationOptionsHandler } from "../handlers/registrationHandler";

const router = Router();

router.get(
	"/generate-registration-options",
	async (req: Request, res: Response) => {
		logger.info("/generate-registration-options execution started");
		console.log(req.hostname);
		const username = req.query.username as string;

		return await generateRegistrationOptionsHandler(res, username);
	}
);

export default router;
