import { base } from "@/infra/rpc/base";
import { createOrderRoute } from "./create";

export const ordersRouter = base.prefix("/orders").router({
	create: createOrderRoute,
});
