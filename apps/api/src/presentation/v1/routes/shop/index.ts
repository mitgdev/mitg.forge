import { base } from "@/infra/rpc/base";
import { ordersRouter } from "./orders";
import { providersRoute } from "./providers";
import { servicesRoute } from "./services";

export const shopRouter = base.tag("Shop").prefix("/shop").router({
	services: servicesRoute,
	providers: providersRoute,
	orders: ordersRouter,
});
