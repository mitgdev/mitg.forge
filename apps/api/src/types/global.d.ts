import type { Context, Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";

declare global {
	export type AuthenticatedSession = {
		token: string;
		email: string;
	};

	export type ContextEnv = {
		Variables: {
			session?: AuthenticatedSession;
		} & RequestIdVariables;
	};

	export type ExtendedHono = Hono<ContextEnv>;
	export type ReqContext = Context<ContextEnv>;
}
