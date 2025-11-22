import { base } from "@/infra/rpc/base";
import { accountsRouter } from "./accounts";
import { clientRouter } from "./client";
import { configRouter } from "./config";
import { pingRoute } from "./ping";
import { sessionRouter } from "./session";
import { worldsRouter } from "./worlds";

export const router = base.router({
	ping: pingRoute,
	client: clientRouter,
	accounts: accountsRouter,
	session: sessionRouter,
	worlds: worldsRouter,
	config: configRouter,
});
