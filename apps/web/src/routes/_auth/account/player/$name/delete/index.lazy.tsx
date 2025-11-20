import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountPlayerDeleteSection } from "@/sections/account_player_delete";

export const Route = createLazyFileRoute("/_auth/account/player/$name/delete/")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { name } = Route.useLoaderData();

	return <AccountPlayerDeleteSection name={name} />;
}
