export type UserType = {
	id: number;
	username: string;
	created_at: Date;
};

export type PasskeyType = {
	cred_id: string;
	cred_public_key: Buffer;
	internal_user_id: number;
	webauthn_user_id: string;
	counter: number;
	backup_eligible: boolean;
	backup_status: boolean;
	transports: string[];
	created_at: Date;
	last_used: Date;
	user_id: number;
};
