import { createLazyFileRoute } from "@tanstack/react-router";
import { ListAccounts } from "@/sections/list_acconts";

export const Route = createLazyFileRoute("/_auth/admin/accounts/list/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ListAccounts />;
}
