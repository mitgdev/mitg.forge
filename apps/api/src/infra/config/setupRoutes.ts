import { createContext } from "@/infra/context";
import { generateOpenAPISpec, openApiHandler } from "@/infra/rpc/open_api";
import { rpcApiHandler } from "@/infra/rpc/rpc_api";
import { generateSwaggerDocument } from "@/infra/rpc/scalar_swagger";

export function setupRoutes(app: ExtendedHono) {
	app.use("/v1/rpc/*", async (c, next) => {
		const context = await createContext({ context: c });

		const { matched, response } = await rpcApiHandler.handle(c.req.raw, {
			prefix: "/v1/rpc",
			context: context,
		});

		if (matched) {
			return c.newResponse(response.body, response);
		}
		await next();
	});

	app.use("/v1/*", async (c, next) => {
		const context = await createContext({ context: c });

		const { matched, response } = await openApiHandler.handle(c.req.raw, {
			prefix: "/v1",
			context: context,
		});

		if (matched) {
			return c.newResponse(response.body, response);
		}

		if (c.req.path === "/v1/openapi.json") {
			const spec = await generateOpenAPISpec();

			return c.newResponse(JSON.stringify(spec), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		if (c.req.path === "/v1/docs") {
			return c.newResponse(generateSwaggerDocument("/v1/openapi.json"), {
				headers: {
					"Content-Type": "text/html",
				},
			});
		}

		await next();
	});
}
