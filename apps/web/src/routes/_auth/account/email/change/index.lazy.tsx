import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountChangeEmailSection } from "@/sections/account_change_email";

export const Route = createLazyFileRoute("/_auth/account/email/change/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountChangeEmailSection />;
}
