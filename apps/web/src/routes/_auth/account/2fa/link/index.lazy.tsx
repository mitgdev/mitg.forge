import { createLazyFileRoute } from "@tanstack/react-router";
import { Account2FALinkSection } from "@/sections/account_2fa_link";

export const Route = createLazyFileRoute("/_auth/account/2fa/link/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Account2FALinkSection />;
}
