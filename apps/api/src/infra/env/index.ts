import { cleanEnv, makeValidator, str } from "envalid";

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
});
