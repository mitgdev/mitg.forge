import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountLostPasswordResetRkSection } from "@/sections/account_lost_password_reset_rk";

export const Route = createLazyFileRoute(
	"/_not_auth/account/lost/$email/password_reset_rk/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountLostPasswordResetRkSection />;
}
