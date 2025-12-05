import { createLazyFileRoute } from "@tanstack/react-router";
import { Account2FAUnlinkSection } from "@/sections/account_2fa_unlink";

export const Route = createLazyFileRoute("/_auth/account/2fa/unlink/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Account2FAUnlinkSection />;
}
