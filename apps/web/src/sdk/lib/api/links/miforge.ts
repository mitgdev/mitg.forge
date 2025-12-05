import { RPCLink } from "@orpc/client/fetch";
import { env } from "@/sdk/env";

export const miforgeLink = new RPCLink({
	url: `${env.VITE_MIFORGE_RPC_URL}${env.VITE_MIFORGE_RPC_PATH}`,
	fetch: async (request, init) => {
		return fetch(request, {
			...init,
			credentials: "include",
			headers: {
				...request.headers,
			},
		});
	},
	headers: {
		"x-miforge-client": "web-sdk",
	},
});
