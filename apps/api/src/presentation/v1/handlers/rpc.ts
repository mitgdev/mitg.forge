import { onError } from "@orpc/client";
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@/presentation/v1/routes";

export const rpcApiHandler = new RPCHandler(router, {
	plugins: [],
	interceptors: [
		onError((error, execution) => {
			const method = execution.request.method;
			const url = execution.request.url.href;

			console.error(`${method} ${url}`, error);
		}),
	],
});
