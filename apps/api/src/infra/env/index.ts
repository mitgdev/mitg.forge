import z from "zod";

const SERVER_CONFIG_SCHEMA = z.object({
	SERVER_HOST: z.string(),
	SERVER_NAME: z.string(),
	SERVER_GAME_PROTOCOL_PORT: z.coerce.number().default(7172),
	SERVER_STATUS_PROTOCOL_PORT: z.coerce.number().default(7171),
	SERVER_LOCATION: z.enum([
		"SOUTH_AMERICA",
		"NORTH_AMERICA",
		"EUROPE",
		"OCEANIA",
	]),
	SERVER_PVP_TYPE: z.enum([
		"NO_PVP",
		"PVP",
		"RETRO_PVP",
		"PVP_ENFORCED",
		"RETRO_HARDCORE",
	]),
});

const AUTHENTICATION_CONFIG_SCHEMA = z.object({
	SESSION_TOKEN_NAME: z.string().default("token"),
	ALLOWED_ORIGINS: z
		.string()
		.transform((val) => val.split(",").map((item) => item.trim())),
	JWT_SECRET: z.string(),
	HASHER_SECRET: z.string(),
});

const REDIS_CONFIG_SCHEMA = z.object({
	REDIS_URL: z.string(),
	REDIS_PUBLISHER_LIVE_PREFIX: z.string().default("miforge:live:"),
});

const DATABASE_CONFIG_SCHEMA = z.object({
	DATABASE_URL: z.string(),
});

const MAILER_CONFIG_SCHEMA = z.object({
	// Mailer Config
	MAILER_PROVIDER: z.enum(["SMTP", "GOOGLE"]).optional(),

	// SMTP Config
	MAILER_FROM_NAME: z.string().default("Mitg Suporte"),
	MAILER_SMTP_HOST: z.string().optional(),
	MAILER_SMTP_PORT: z.coerce.number().optional(),
	MAILER_SMTP_SECURE: z.coerce.boolean().optional(),
	MAILER_SMTP_USER: z.string().optional(),
	MAILER_SMTP_PASS: z.string().optional(),

	// Google
	MAILER_GOOGLE_TYPE: z.string().default("OAuth2"),
	MAILER_GOOGLE_USER: z.string().optional(),
	MAILER_GOOGLE_CLIENT_ID: z.string().optional(),
	MAILER_GOOGLE_CLIENT_SECRET: z.string().optional(),
	MAILER_GOOGLE_REFRESH_TOKEN: z.string().optional(),
});

const FRONTEND_CONFIG_SCHEMA = z.object({
	FRONTEND_URL: z.url(),
});

const envSchema = z.object({
	...FRONTEND_CONFIG_SCHEMA.shape,
	...SERVER_CONFIG_SCHEMA.shape,
	...DATABASE_CONFIG_SCHEMA.shape,
	...AUTHENTICATION_CONFIG_SCHEMA.shape,
	...REDIS_CONFIG_SCHEMA.shape,
	...MAILER_CONFIG_SCHEMA.shape,
	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
	SERVICE_NAME: z.string().default("miforge-api"),
	PORT: z.coerce.number().default(4000),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	isDev: z.boolean().default(process.env.NODE_ENV !== "production"),
	isProd: z.boolean().default(process.env.NODE_ENV === "production"),
});

export const env = envSchema
	.superRefine((env, ctx) => {
		if (!env.MAILER_PROVIDER) return;

		if (env.MAILER_PROVIDER === "SMTP") {
			const requiredFields: (keyof typeof env)[] = [
				"MAILER_SMTP_HOST",
				"MAILER_SMTP_PORT",
				"MAILER_SMTP_USER",
				"MAILER_SMTP_PASS",
			];

			for (const field of requiredFields) {
				if (!env[field]) {
					ctx.addIssue({
						code: "custom",
						message: `${field} is required when MAILER_PROVIDER is SMTP`,
						path: [field],
					});
				}
			}
		}

		if (env.MAILER_PROVIDER === "GOOGLE") {
			const requiredFields: (keyof typeof env)[] = [
				"MAILER_GOOGLE_USER",
				"MAILER_GOOGLE_CLIENT_ID",
				"MAILER_GOOGLE_CLIENT_SECRET",
				"MAILER_GOOGLE_REFRESH_TOKEN",
			];

			for (const field of requiredFields) {
				if (!env[field]) {
					ctx.addIssue({
						code: "custom",
						message: `${field} is required when MAILER_PROVIDER is GOOGLE`,
						path: [field],
					});
				}
			}
		}
	})
	.parse(process.env);
