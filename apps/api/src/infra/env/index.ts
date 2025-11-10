import { bool, cleanEnv, makeValidator, num, str } from "envalid";

const arrayFromString = makeValidator<string[]>((input) => {
	return input.split(",").map((item) => item.trim());
});

export const env = cleanEnv(process.env, {
	LOG_LEVEL: str({
		choices: ["debug", "info", "warn", "error"],
		default: "info",
		desc: "The logging level",
	}),
	SERVICE_NAME: str({
		default: "miforge-api",
		desc: "The name of this server",
	}),
	SESSION_TOKEN_NAME: str({
		default: "token",
		desc: "The name of the session token cookie",
	}),
	PORT: str({
		default: "4000",
		desc: "The port the server will listen on",
	}),
	JWT_SECRET: str({
		desc: "The secret key used to sign JWT tokens",
	}),
	ALLOWED_ORIGINS: arrayFromString({
		desc: "A comma-separated list of allowed origins for CORS",
	}),
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
});
