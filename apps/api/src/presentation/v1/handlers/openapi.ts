import { onError } from "@orpc/client";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { router } from "@/presentation/v1/routes";

export const openApiHandler = new OpenAPIHandler(router, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "ORPC Playground",
					version: "1.0.0",
				},
			},
		}),
	],
	interceptors: [
		onError((error, execution) => {
			const method = execution.request.method;
			const url = execution.request.url.href;

			console.error(`${method} ${url}`, error);
		}),
	],
});

export const openAPIGenerator = new OpenAPIGenerator({
	schemaConverters: [new ZodToJsonSchemaConverter()],
});

export const generateOpenAPISpec = async () => {
	return openAPIGenerator.generate(router, {
		info: {
			title: "My Playground",
			version: "1.0.0",
		},
		servers: [{ url: "/v1" } /** Should use absolute URLs in production */],
		security: [{ bearerAuth: [] }],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
				},
			},
		},
	});
};
