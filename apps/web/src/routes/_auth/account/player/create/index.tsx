import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_auth/account/player/create/")({
	loader: async ({ context }) => {
		await context.clients.query.ensureQueryData(
			api.query.miforge.worlds.list.queryOptions(),
		);
	},
});
