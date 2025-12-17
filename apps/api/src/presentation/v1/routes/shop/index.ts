import { base } from "@/infra/rpc/base";
import { orderFormRouter } from "./orderform";
import { productsRouter } from "./products";

export const shopRouter = base.prefix("/shop").tag("Shop").router({
	orderForm: orderFormRouter,
	products: productsRouter,
});
