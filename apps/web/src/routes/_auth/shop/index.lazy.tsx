import { createLazyFileRoute } from "@tanstack/react-router";
import { ShopSection } from "@/sections/shop";

export const Route = createLazyFileRoute("/_auth/shop/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ShopSection />;
}
