import { ORPCError } from "@orpc/client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_auth/account/email/change/$token")({
	loader: async ({ params, context }) => {
		const token = params.token;

		const isValid = await context.clients.query
			.fetchQuery(
				api.query.miforge.accounts.email.previewChange.queryOptions({
					input: {
						token,
					},
				}),
			)
			.catch((error) => {
				if (error instanceof ORPCError) {
					toast.error(error.message);
				}

				return null;
			});

		if (!isValid) {
			throw redirect({
				to: "/account/details",
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
