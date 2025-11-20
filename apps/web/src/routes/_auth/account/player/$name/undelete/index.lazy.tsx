import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountPlayerUndeleteSection } from "@/sections/account_player_undelete";

export const Route = createLazyFileRoute(
	"/_auth/account/player/$name/undelete/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { name } = Route.useLoaderData();
	return <AccountPlayerUndeleteSection name={name} />;
}
