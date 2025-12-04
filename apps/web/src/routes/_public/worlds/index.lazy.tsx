import { createLazyFileRoute } from "@tanstack/react-router";
import { WorldsSection } from "@/sections/worlds";

export const Route = createLazyFileRoute("/_public/worlds/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <WorldsSection />;
}
