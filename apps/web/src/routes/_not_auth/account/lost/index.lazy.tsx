import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountLostSection } from "@/sections/account_lost";

export const Route = createLazyFileRoute("/_not_auth/account/lost/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountLostSection />;
}
