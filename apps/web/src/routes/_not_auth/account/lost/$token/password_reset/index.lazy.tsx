import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountLostPasswordResetSection } from "@/sections/account_lost_password_reset";

export const Route = createLazyFileRoute(
	"/_not_auth/account/lost/$token/password_reset/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountLostPasswordResetSection />;
}
