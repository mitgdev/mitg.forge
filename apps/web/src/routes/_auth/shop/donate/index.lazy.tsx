import { createLazyFileRoute } from "@tanstack/react-router";
import { ShopDonateSection } from "@/sections/shop_donate";

export const Route = createLazyFileRoute("/_auth/shop/donate/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ShopDonateSection />;
}
