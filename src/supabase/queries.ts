import { PostgrestError } from "@supabase/supabase-js";
import supabase from "./config";
import { PasskeyType, UserType } from "./types";

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
			console.error("Error fetching user by username:", error);
			return [null, error];
		}

		return [data as UserType, null];
	} catch (error) {
		console.error("Unexpected error:", error);
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
			console.error("Error inserting user:", error);
			return [null, error];
		}

		return [data as UserType, null];
	} catch (error) {
		console.error("Unexpected error:", error);
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
			console.error("Error fetching passkeys by user ID:", error);
			return [null, error];
		}

		return [data as PasskeyType[], null];
	} catch (error) {
		console.error("Unexpected error:", error);
		return [null, error as Error];
	}
};
