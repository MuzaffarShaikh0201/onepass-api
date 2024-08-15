import dotenv from "dotenv";

dotenv.config();

class EnvConfig {
	private static instance: EnvConfig;

	public readonly PORT: number;
	public readonly RP_NAME: string;
	public readonly RP_ID: string;
	public readonly SUPABASE_ANON_KEY: string;
	public readonly SUPABASE_URL: string;

	private constructor() {
		this.PORT = parseInt(this.getEnvVariable("PORT"), 3000);
		this.RP_NAME = this.getEnvVariable("RP_NAME");
		this.RP_ID = this.getEnvVariable("RP_ID");
		this.SUPABASE_ANON_KEY = this.getEnvVariable("SUPABASE_ANON_KEY");
		this.SUPABASE_URL = this.getEnvVariable("SUPABASE_URL");
	}

	public static getInstance(): EnvConfig {
		if (!EnvConfig.instance) {
			EnvConfig.instance = new EnvConfig();
		}
		return EnvConfig.instance;
	}

	private getEnvVariable(key: string, defaultValue?: string): string {
		const value = process.env[key] || defaultValue;
		if (value === undefined) {
			throw new Error(`Missing environment variable: ${key}`);
		}
		return value;
	}
}

export const envConfig = EnvConfig.getInstance();
