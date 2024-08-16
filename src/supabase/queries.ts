import supabase from "./config";
import { PostgrestError } from "@supabase/supabase-js";
import { PasskeyType, UserRegistrationOptionsType, UserType } from "./types";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/server/script/deps";
import logger from "../utils/logger";

export const getUserByUsername = async (
	username: string
): Promise<[UserType | null, Error | PostgrestError | null]> => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("username", username)
			.maybeSingle();

		if (error) {
			logger.error(`Error fetching user by username`);
			return [null, error];
		}

		return [data as UserType, null];
	} catch (error) {
		logger.error(`Unexpected error`);
		return [null, error as Error];
	}
};

export const insertUser = async (
	user: Omit<UserType, "id" | "created_at">
): Promise<[UserType | null, Error | PostgrestError | null]> => {
	try {
		const { data, error } = await supabase
			.from("users")
			.insert([{ username: user.username }])
			.select()
			.single();

		if (error) {
			logger.error(`Error inserting user`);
			return [null, error];
		}

		return [data as UserType, null];
	} catch (error) {
		logger.error(`Unexpected error`);
		return [null, error as Error];
	}
};

export const getPasskeysByUserId = async (
	userId: number
): Promise<[PasskeyType[] | null, Error | PostgrestError | null]> => {
	try {
		const { data, error } = await supabase
			.from("passkeys")
			.select("*")
			.eq("user_id", userId);

		if (error) {
			logger.error(`Error fetching passkeys by user ID`);
			return [null, error];
		}

		return [data as PasskeyType[], null];
	} catch (error) {
		logger.error(`Unexpected error`);
		return [null, error as Error];
	}
};

export const insertUserRegistrationOptions = async (
	userId: number,
	options: PublicKeyCredentialCreationOptionsJSON
): Promise<[Error | PostgrestError | null]> => {
	try {
		const { error } = await supabase
			.from("user_registration_options")
			.insert([{ user_id: userId, options: options }]);

		if (error) {
			logger.error(`Error inserting user registration options`);
			return [error];
		}

		return [null];
	} catch (error) {
		logger.error(`Unexpected error`);
		return [error as Error];
	}
};
