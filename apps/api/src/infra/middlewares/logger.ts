import { container } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";

export function loggerMiddleware() {
	return async (context: HttpContext, next: () => Promise<void>) => {
		const start = Date.now();
		const requestId = context.get("requestId");
		const logger = container.resolve(TOKENS.Logger);

		const requestInfo = {
			method: context.req.method,
			url: context.req.url,
			query: context.req.query(),
			params: context.req.param(),
		};

		try {
			await next();
		} finally {
			const duration = Date.now() - start;
			const status = context.res.status;
			let level: "info" | "warn" | "error" = "info";

			if (status >= 500) {
				level = "error";
			} else if (status >= 400) {
				level = "warn";
			}

			const message = `${requestInfo.method} ${requestInfo.url} - ${status} (${duration}ms)`;

			logger[level](message, {
				requestId,
				status,
				duration,
				request: requestInfo,
			});
		}

		// logger.info(`Incoming request: ${method} ${url}`, {
		// 	requestId,
		// });
	};
}
