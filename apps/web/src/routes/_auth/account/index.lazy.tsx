import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountSection } from "@/sections/account";

export const Route = createLazyFileRoute("/_auth/account/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountSection />;
}
