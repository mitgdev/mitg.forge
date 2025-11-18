import { Hono } from "hono";
import { setupMiddlewares } from "./setupMiddlewares";
import { setupRoutes } from "./setupRoutes";

export function appFactory() {
	const app = new Hono<ContextEnv>();

	setupMiddlewares(app);
	setupRoutes(app);

	return app;
}
