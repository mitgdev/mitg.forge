import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountPlayerCreateSection } from "@/sections/account_player_create";

export const Route = createLazyFileRoute("/_auth/account/player/create/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountPlayerCreateSection />;
}
