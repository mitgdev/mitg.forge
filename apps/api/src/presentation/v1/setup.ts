import { createContext } from "@/infra/context";
import { generateSwaggerDocument } from "@/infra/rpc/scalar_swagger";
import { generateOpenAPISpec, openApiHandler } from "./handlers/openapi";
import { rpcApiHandler } from "./handlers/rpc";

const VERSION = "v1";
const OPENAPI_FILE = "openapi.json";

export function setupV1(app: ExtendedHono) {
	app.use(`/${VERSION}/rpc/*`, async (c, next) => {
		const context = await createContext({ context: c });
		const { matched, response } = await rpcApiHandler.handle(c.req.raw, {
			prefix: `/${VERSION}/rpc`,
			context,
		});
		if (matched) return c.newResponse(response.body, response);
		await next();
	});

	app.get(`/${VERSION}/${OPENAPI_FILE}`, async (c) => {
		const spec = await generateOpenAPISpec();
		return c.json(spec);
	});

	app.get(`/${VERSION}/docs`, async (c) => {
		return c.html(generateSwaggerDocument(`/${VERSION}/${OPENAPI_FILE}`));
	});

	app.use(`/${VERSION}/*`, async (c, next) => {
		const context = await createContext({ context: c });

		const { matched, response } = await openApiHandler.handle(c.req.raw, {
			prefix: `/${VERSION}`,
			context,
		});

		if (matched) {
			return c.newResponse(response.body, response);
		}

		await next();
	});
}
