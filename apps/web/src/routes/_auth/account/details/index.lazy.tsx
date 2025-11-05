import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountDetailsSection } from "@/sections/account_details";

export const Route = createLazyFileRoute("/_auth/account/details/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountDetailsSection />;
}
