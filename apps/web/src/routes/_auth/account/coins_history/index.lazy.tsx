import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountCoinsHistorySection } from "@/sections/account_coins_history";

export const Route = createLazyFileRoute("/_auth/account/coins_history/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountCoinsHistorySection />;
}
