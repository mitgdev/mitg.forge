import { base } from "@/infra/rpc/base";
import { orderFormAddOrUpdateItemRoute } from "./addOrUpdateItem";
import { orderFormRoute } from "./mostRecent";
import { orderFormRemoveItemRoute } from "./removeItem";

export const orderFormRouter = base.prefix("/orderform").router({
	getMostRecent: orderFormRoute,
	addOrUpdateItem: orderFormAddOrUpdateItemRoute,
	removeItem: orderFormRemoveItemRoute,
});
