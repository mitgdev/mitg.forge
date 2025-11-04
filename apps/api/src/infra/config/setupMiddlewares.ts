import { honoContextStorage } from "@/infra/middlewares/contextStorage";
import { honoCors } from "@/infra/middlewares/cors";
import { honoRequestId } from "@/infra/middlewares/request_id";

export function setupMiddlewares(app: ExtendedHono): void {
	app.use(honoCors());
	app.use(honoContextStorage());
	app.use(honoRequestId());
}
