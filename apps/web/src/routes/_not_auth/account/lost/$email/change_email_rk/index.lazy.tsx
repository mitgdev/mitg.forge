import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountLostChangeEmailRkSection } from "@/sections/account_lost_change_email_rk";

export const Route = createLazyFileRoute(
	"/_not_auth/account/lost/$email/change_email_rk/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountLostChangeEmailRkSection />;
}
