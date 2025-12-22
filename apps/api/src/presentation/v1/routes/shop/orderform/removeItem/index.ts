import { ShopOrderFormRemoveItemContractSchema } from "@/application/usecases/shop/orderformRemoveItem/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const orderFormRemoveItemRoute = isAuthenticatedProcedure
	.route({
		method: "DELETE",
		path: "/items/{itemId}",
		summary: "Remove Item from Order Form",
		description: "Removes an item from the order form for the shop.",
	})
	.input(ShopOrderFormRemoveItemContractSchema.input)
	.output(ShopOrderFormRemoveItemContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.shop.orderFormRemoveItem.execute(input);
	});
