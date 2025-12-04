import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/sdk/lib/api/factory";

export const Route = createFileRoute("/_auth/account/2fa/unlink/")({
	loader: async ({ context }) => {
		const accountDetails = await context.clients.query.fetchQuery(
			api.query.miforge.accounts.details.queryOptions(),
		);

		const isTwoFactorEnabled = accountDetails.two_factor_enabled;

		if (!isTwoFactorEnabled) {
			toast.error("Two-factor authentication is not enabled on this account.");

			throw redirect({
				to: "/account/details",
			});
		}
	},
});
