import { createFileRoute } from "@tanstack/react-router";

import { FeaturedSection } from "@/sections/featured";
import { NewsSection } from "@/sections/news";
import { NewstickerSection } from "@/sections/newsticker";

export const Route = createFileRoute("/_public/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<NewstickerSection />
			<FeaturedSection />
			<NewsSection />
		</>
	);
}
