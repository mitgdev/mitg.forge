import { base } from "@/infra/rpc/base";
import { outfitsPreviewRoute } from "./list";
import { outfitPreviewRoute } from "./preview";

export const outfitRouter = base.tag("Outfit").prefix("/outfit").router({
	preview: outfitPreviewRoute,
	list: outfitsPreviewRoute,
});
