import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountLost2FAResetRkSection } from "@/sections/account_lost_2fa_reset_rk";

export const Route = createLazyFileRoute(
	"/_not_auth/account/lost/$email/disabled_2fa_rk/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountLost2FAResetRkSection />;
}
