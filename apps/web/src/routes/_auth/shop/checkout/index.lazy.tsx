import { createLazyFileRoute } from "@tanstack/react-router";
import { ShopCheckoutSection } from "@/sections/shop_checkout";

export const Route = createLazyFileRoute("/_auth/shop/checkout/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ShopCheckoutSection />;
}
