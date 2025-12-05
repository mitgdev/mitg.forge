import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_not_auth/account/lost/$token")({
	loader: async ({ params, context }) => {
		const { token } = params;

		await context.clients.query
			.fetchQuery(
				api.query.miforge.lost.validConfirmationToken.queryOptions({
					input: {
						token,
					},
				}),
			)
			.catch(() => {
				toast.error("The confirmation token is invalid or has expired.");

				throw redirect({
					to: "/account/lost",
				});
			});
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
