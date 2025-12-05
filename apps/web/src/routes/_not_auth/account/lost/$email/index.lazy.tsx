import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountLostOptionsSection } from "@/sections/account_lost_options";

export const Route = createLazyFileRoute("/_not_auth/account/lost/$email/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountLostOptionsSection />;
}
