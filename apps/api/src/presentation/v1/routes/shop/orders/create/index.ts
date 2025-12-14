import { ShopCreateOrderContractSchema } from "@/application/usecases/shop/createOrder/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const createOrderRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/",
		summary: "Create Order",
		description: "Create a new order",
	})
	.input(ShopCreateOrderContractSchema.input)
	.output(ShopCreateOrderContractSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.shop.orderCreate.execute(input);
	});
