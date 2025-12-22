import { ShopOrderFormSetPaymentOptionContractSchema } from "@/application/usecases/shop/orderformSetPaymentOption/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const orderFormSetPaymentRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/",
		summary: "Set OrderForm Payment",
		description: "Sets the payment information for the order form in the shop.",
	})
	.input(ShopOrderFormSetPaymentOptionContractSchema.input)
	.output(ShopOrderFormSetPaymentOptionContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.shop.orderFormSetPaymentOption.execute({
			paymentOptionId: input.paymentOptionId,
		});
	});
