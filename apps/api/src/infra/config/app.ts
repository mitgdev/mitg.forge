import { Hono } from "hono";
import { setupMiddlewares } from "./setupMiddlewares";
import { setupRoutes } from "./setupRoutes";

const app = new Hono<ContextEnv>();

setupMiddlewares(app);
setupRoutes(app);

export { app };
