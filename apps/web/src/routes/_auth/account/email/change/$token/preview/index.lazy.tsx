import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountChangeEmailPreviewSection } from "@/sections/account_change_email_preview";

export const Route = createLazyFileRoute(
	"/_auth/account/email/change/$token/preview/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AccountChangeEmailPreviewSection />;
}
