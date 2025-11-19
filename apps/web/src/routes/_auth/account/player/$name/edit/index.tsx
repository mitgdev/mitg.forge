import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_auth/account/player/$name/edit/")({
	loader: async ({ params, context }) => {
		const characterName = params.name;

		const character = await context.clients.query
			.ensureQueryData(
				api.query.miforge.accounts.characters.findByName.queryOptions({
					input: {
						name: characterName,
					},
				}),
			)
			.catch(() => null);

		if (!character) {
			throw redirect({
				to: "/account",
				state: true,
			});
		}

		const hasDeletionScheduled = !!character.deletion;

		if (hasDeletionScheduled) {
			throw redirect({
				to: "/account",
				state: true,
			});
		}

		return {
			name: character.name,
		};
	},
});
