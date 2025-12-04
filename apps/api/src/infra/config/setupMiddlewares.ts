import { honoContextStorage } from "@/infra/middlewares/contextStorage";
import { honoCors } from "@/infra/middlewares/cors";
import { honoRequestId } from "@/infra/middlewares/request_id";
import { loggerMiddleware } from "../middlewares/logger";

export function setupMiddlewares(app: ExtendedHono): void {
	app.use(honoCors());
	app.use(honoContextStorage());
	app.use(honoRequestId());
	app.use(loggerMiddleware());
}
