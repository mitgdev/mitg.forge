import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_not_auth/account/lost/$email")({
	loader: async ({ params }) => {
		const { email } = params;

		await api.client.miforge.lost
			.findByEmail({
				email: email,
			})
			.catch(() => {
				toast.error("Email not found");

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
