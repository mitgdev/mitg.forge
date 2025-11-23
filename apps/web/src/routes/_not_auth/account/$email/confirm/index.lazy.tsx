import { createLazyFileRoute } from "@tanstack/react-router";
import { AccountConfirmEmailSection } from "@/sections/account_confirm_email";

export const Route = createLazyFileRoute("/_not_auth/account/$email/confirm/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { email } = Route.useParams();

	return <AccountConfirmEmailSection email={email} />;
}
