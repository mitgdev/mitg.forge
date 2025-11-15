import { createLazyFileRoute } from "@tanstack/react-router";

import { AccountRegistrationSection } from "@/sections/account_registration";

export const Route = createLazyFileRoute("/_auth/account/registration/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountRegistrationSection />;
}
