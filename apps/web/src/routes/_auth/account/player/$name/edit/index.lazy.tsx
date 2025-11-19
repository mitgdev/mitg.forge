import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountPlayerEditSection } from "@/sections/account_player_edit";

export const Route = createLazyFileRoute("/_auth/account/player/$name/edit/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { name } = Route.useLoaderData();

	return <AccountPlayerEditSection name={name} />;
}
