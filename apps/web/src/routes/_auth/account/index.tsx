import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_auth/account/")({
	loader: async ({ context }) => {
		await context.clients.query.ensureQueryData(
			api.query.miforge.accounts.details.queryOptions(),
		);

		await context.clients.query.ensureQueryData(
			api.query.miforge.accounts.characters.list.queryOptions({
				input: {
					page: 1,
					limit: 99,
				},
			}),
		);
	},
});
