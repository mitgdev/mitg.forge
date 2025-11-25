import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountResetPasswordSection } from "@/sections/account_reset_password";

export const Route = createLazyFileRoute("/_auth/account/reset_password/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountResetPasswordSection />;
}
