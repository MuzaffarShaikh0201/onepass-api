import { Response } from "express";
import { generateRegistrationOptions } from "@simplewebauthn/server";

import { UserType } from "../supabase/types";
import { envConfig } from "../core/envConfig";
import {
	getPasskeysByUserId,
	getUserByUsername,
	insertUser,
	insertUserRegistrationOptions,
} from "../supabase/queries";
import logger from "../utils/logger";

const rpName = envConfig.RP_NAME;
const rpID = envConfig.RP_ID;

export const generateRegistrationOptionsHandler = async (
	res: Response,
	username: string
) => {
	logger.info("Generating registration options");

	try {
		const [user, error] = await getUserByUsername(username);

		if (error) {
			logger.error(error);
			return res.status(500).json({ message: "Something went wrong!" });
		}

		if (user) {
			const [passkeys, passkeysError] = await getPasskeysByUserId(
				user.id as number
			);

			if (passkeysError) {
				logger.error(passkeysError);
				return res.status(500).json({ message: "Something went wrong!" });
			}

			const options = await generateRegistrationOptions({
				rpName,
				rpID,
				userID: new Uint8Array(user.id.toString().split(",").map(Number)),
				userName: username,
				userDisplayName: username.toLocaleUpperCase(),
				attestationType: "indirect",
				authenticatorSelection: { userVerification: "required" },
				excludeCredentials: passkeys?.map((pk) => ({
					id: pk.cred_id,
					type: "public-key",
				})),
			});

			const [error] = await insertUserRegistrationOptions(user.id, options);

			if (error) {
				logger.error(error);
				return res.status(500).json({ message: "Something went wrong!" });
			}

			logger.info("Registration options generated successfully");
			return res.status(201).json(options);
		} else {
			let [user, error] = await insertUser({ username });

			user = user as UserType;

			if (error) {
				logger.error(error);
				return res.status(500).json({ message: "Something went wrong!" });
			}

			const [passkeys, passkeysError] = await getPasskeysByUserId(
				user.id as number
			);

			if (passkeysError) {
				logger.error(passkeysError);
				return res.status(500).json({ message: "Something went wrong!" });
			}

			const options = await generateRegistrationOptions({
				rpName,
				rpID,
				userID: new Uint8Array(user.id.toString().split(",").map(Number)),
				userName: username,
				attestationType: "none",
				authenticatorSelection: {
					userVerification: "preferred",
				},
				excludeCredentials: passkeys?.map((pk) => ({
					id: pk.cred_id,
					type: "public-key",
				})),
			});

			const [insertUserRegistrationOptionsError] =
				await insertUserRegistrationOptions(user.id, options);

			if (insertUserRegistrationOptionsError) {
				logger.error(insertUserRegistrationOptionsError);
				return res.status(500).json({ message: "Something went wrong!" });
			}

			logger.info("Registration options generated successfully");
			return res.status(201).json(options);
		}
	} catch (error) {
		logger.error(error);
		return res.status(500).json({ message: "Something went wrong!" });
	}
};
