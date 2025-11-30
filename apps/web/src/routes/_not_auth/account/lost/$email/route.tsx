import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_not_auth/account/lost/$email")({
	loader: async ({ params }) => {
		const { email } = params;

		const parseResult = await z.email().safeParseAsync(email);

		if (!parseResult.success) {
			toast.error("Invalid email");

			throw redirect({
				to: "/account/lost",
			});
		}

		await api.client.miforge.lost
			.findByEmail({
				email: parseResult.data,
			})
			.catch(() => {
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
