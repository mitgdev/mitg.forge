import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
	"/_not_auth/account/lost/password_reset/$token/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_not_auth/account/lost/password_reset/$token/"!</div>;
}
