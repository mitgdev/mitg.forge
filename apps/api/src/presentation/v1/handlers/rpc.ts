import { onError } from "@orpc/client";
import { RPCHandler } from "@orpc/server/fetch";
import { container } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import { router } from "@/presentation/v1/routes";

export const rpcApiHandler = new RPCHandler(router, {
	plugins: [],
	interceptors: [
		onError((error, execution) => {
			const method = execution.request.method;
			const url = execution.request.url.href;

			const logger = container.resolve(TOKENS.Logger);

			logger.error(`${method} ${url}`, {
				error,
			});
		}),
	],
});
