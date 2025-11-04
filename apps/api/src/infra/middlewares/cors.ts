import { cors } from "hono/cors";
import { env } from "@/infra/env";

const allowedOrigins = new Set(env.ALLOWED_ORIGINS);

export function honoCors() {
	return cors({
		origin: (origin) => (origin && allowedOrigins.has(origin) ? origin : ""),
		credentials: true,
	});
}
