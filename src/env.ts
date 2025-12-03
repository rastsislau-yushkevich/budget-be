import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.string().default("3000"),
	ACCESS_TOKEN_SECRET: z.string().min(1),
	REFRESH_TOKEN_SECRET: z.string().min(1),
	TINK_BASE_URL: z.url(),
	TINK_LINK_BASE_URL: z.url(),
	TINK_CLIENT_ID: z.string().min(1),
	TINK_CLIENT_SECRET: z.string().min(1),
	TINK_ENVIRONMENT: z.enum(["sandbox", "production"]),
	REDIRECT_URI: z.url(),
});

export const env = envSchema.parse(process.env);
