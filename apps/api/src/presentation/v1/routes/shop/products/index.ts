import { base } from "@/infra/rpc/base";
import { productsSearchRoute } from "./search";

export const productsRouter = base.prefix("/products").router({
	search: productsSearchRoute,
});
