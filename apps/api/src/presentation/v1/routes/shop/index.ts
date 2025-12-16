import { base } from "@/infra/rpc/base";
import { orderFormRoute } from "./orderform";

export const shopRouter = base.prefix("/shop").tag("Shop").router({
	orderForm: orderFormRoute,
});
