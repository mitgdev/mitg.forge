import { bool, cleanEnv, makeValidator, num, str } from "envalid";

const arrayFromString = makeValidator<string[]>((input) => {
	return input.split(",").map((item) => item.trim());
});

const SERVER_CONFIG = {
	SERVER_HOST: str({
		desc: "The IP address or hostname of the game server",
	}),
	SERVER_NAME: str({
		desc: "The name of the game server",
	}),
	SERVER_GAME_PROTOCOL_PORT: num({
		desc: "The port number for the game protocol",
		default: 7172,
	}),
	SERVER_STATUS_PROTOCOL_PORT: num({
		desc: "The port number for the status protocol",
		default: 7171,
	}),
	SERVER_LOCATION: str({
		choices: ["SOUTH_AMERICA", "NORTH_AMERICA", "EUROPE", "OCEANIA"],
		desc: "The location of the server",
	}),
	SERVER_PVP_TYPE: str({
		choices: ["NO_PVP", "PVP", "RETRO_PVP", "PVP_ENFORCED", "RETRO_HARDCORE"],
		desc: "The PvP type of the server",
	}),
};

const DATABASE_CONFIG = {
	DATABASE_HOST: str({
		desc: "Database host",
	}),
	DATABASE_USER: str({
		desc: "Database user",
	}),
	DATABASE_PASSWORD: str({
		desc: "Database password",
	}),
	DATABASE_NAME: str({
		desc: "Database name",
	}),
};

const MAILER_CONFIG = {
	MAILER_ENABLED: bool({
		default: false,
		desc: "Whether the mailer is enabled",
	}),
	MAILER_FROM_NAME: str({
		default: "Mitg Suporte",
		desc: "The name displayed in the 'from' field of sent emails",
	}),
	MAILER_SMTP_HOST: str({
		default: "smtp.host.com",
		desc: "The SMTP host for sending emails",
	}),
	MAILER_SMTP_PORT: num({
		default: 465,
		choices: [465, 587],
		desc: "The SMTP port for sending emails",
	}),
	MAILER_SMTP_SECURE: bool({
		default: true,
		desc: "Whether to use a secure connection for SMTP",
	}),
	MAILER_SMTP_USER: str({
		default: "suporte@mitg.gg",
		desc: "The SMTP user for sending emails",
	}),
	MAILER_SMTP_PASS: str({
		default: "",
		desc: "The SMTP password for sending emails",
	}),
	MAILER_GOOGLE_TYPE: str({
		default: "OAuth2",
		choices: ["OAuth2"],
		desc: "The Google OAuth2 type for sending emails",
	}),
	MAILER_GOOGLE_USER: str({
		default: "",
		desc: "The Google OAuth2 user email for sending emails",
	}),
	MAILER_GOOGLE_CLIENT_ID: str({
		default: "",
		desc: "The Google OAuth2 client ID for sending emails",
	}),
	MAILER_GOOGLE_CLIENT_SECRET: str({
		default: "",
		desc: "The Google OAuth2 client secret for sending emails",
	}),
	MAILER_GOOGLE_REFRESH_TOKEN: str({
		default: "",
		desc: "The Google OAuth2 refresh token for sending emails",
	}),
};

const AUTHENTICATION_CONFIG = {
	SESSION_TOKEN_NAME: str({
		default: "token",
		desc: "The name of the session token cookie",
	}),
	ALLOWED_ORIGINS: arrayFromString({
		desc: "A comma-separated list of allowed origins for CORS",
	}),
	JWT_SECRET: str({
		desc: "The secret key used to sign JWT tokens",
	}),
};

export const env = cleanEnv(process.env, {
	...SERVER_CONFIG,
	...DATABASE_CONFIG,
	...MAILER_CONFIG,
	...AUTHENTICATION_CONFIG,
	LOG_LEVEL: str({
		choices: ["debug", "info", "warn", "error"],
		default: "info",
		desc: "The logging level",
	}),
	SERVICE_NAME: str({
		default: "miforge-api",
		desc: "The name of this server",
	}),
	PORT: str({
		default: "4000",
		desc: "The port the server will listen on",
	}),

	REDIS_URL: str({
		desc: "The Redis connection URL",
	}),
});
