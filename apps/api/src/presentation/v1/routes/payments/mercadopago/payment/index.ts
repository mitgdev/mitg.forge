import { publicProcedure } from "@/presentation/procedures/public";

export const mercadopagoPaymentRoute = publicProcedure
	.route({
		method: "POST",
		path: "/payment",
		summary: "Create MercadoPago Payment",
		description: "Endpoint to create a test payment in MercadoPago.",
	})
	.handler(async ({ input, context }) => {
		return { message: "Payment test endpoint" };
	});
