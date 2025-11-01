import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Layout } from "@/layout";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const session = await context.clients.query
			.fetchQuery(api.query.miforge.session.info.queryOptions())
			.catch(() => null);

		if (!session || !session.authenticated) {
			throw redirect({
				to: "/login",
				state: true,
			});
		}
	},
});

function RouteComponent() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
