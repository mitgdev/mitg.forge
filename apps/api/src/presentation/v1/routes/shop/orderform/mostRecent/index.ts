import { ShopOrderFormContractSchema } from "@/application/usecases/shop/orderform/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const orderFormRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/",
		summary: "OrderForm",
		description: "Retrieves information about the order form for the shop.",
	})
	.input(ShopOrderFormContractSchema.input)
	.output(ShopOrderFormContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.shop.orderForm.execute({});
	});
