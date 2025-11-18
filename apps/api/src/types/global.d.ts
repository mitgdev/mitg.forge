import type { Context, Hono } from "hono";
import type { RequestIdVariables } from "hono/request-id";
import type { AccountType } from "@/shared/utils/account/type";

declare global {
	export type Permission = {
		type: AccountType;
	};

	export type AuthenticatedSession = {
		token: string;
		id: number;
		email: string;
		type: AccountType;
	};

	export type ContextEnv = {
		Variables: {
			session?: AuthenticatedSession;
		} & RequestIdVariables;
	};

	export type ExtendedHono = Hono<ContextEnv>;
	export type ReqContext = Context<ContextEnv>;
}
