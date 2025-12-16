import { ShopOrderFormAddOrUpdateItemContractSchema } from "@/application/usecases/shop/orderformAddOrUpdateItem/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const orderFormAddOrUpdateItemRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/items",
		summary: "Add or Update Item in Order Form",
		description: "Adds or updates an item in the order form for the shop.",
	})
	.input(ShopOrderFormAddOrUpdateItemContractSchema.input)
	.output(ShopOrderFormAddOrUpdateItemContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.shop.orderFormAddOrUpdateItem.execute(input);
	});
