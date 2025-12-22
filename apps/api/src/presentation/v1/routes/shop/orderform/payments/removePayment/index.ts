import { ShopOrderFormRemovePaymentOptionContractSchema } from "@/application/usecases/shop/orderformRemovePaymentOption/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const orderFormRemovePaymentRoute = isAuthenticatedProcedure
	.route({
		method: "DELETE",
		path: "/",
		summary: "Remove OrderForm Payment",
		description:
			"Removes the payment information for the order form in the shop.",
	})
	.input(ShopOrderFormRemovePaymentOptionContractSchema.input)
	.output(ShopOrderFormRemovePaymentOptionContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.shop.orderFormRemovePaymentOption.execute(
			undefined,
		);
	});
