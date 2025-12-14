// import { TOKENS } from "@/infra/di/tokens";

// import { publicProcedure } from "@/presentation/procedures/public";

// export const mercadopagoPaymentTestRoute = publicProcedure
// 	.route({
// 		method: "POST",
// 		path: "/payment-test",
// 		summary: "MercadoPago Webhook",
// 		description:
// 			"Endpoint to receive notifications from MercadoPago about payment events.",
// 	})
// 	.handler(async ({ input, context }) => {
// 		const mercadoPagoClient = context.di.resolve(TOKENS.MercadoPagoClient);

// 		const response = await mercadoPagoClient.createPayment({
// 			x_idempotency_key: "TEST_PIX_KEY_6",
// 			external_reference: "TEST_PIX_6",
// 			payment_method_id: "pix",
// 			installments: 1,
// 			notification_url:
// 				"https://05c9e00e89ac.ngrok-free.app/v1/payments/mercadopago/webhook",
// 			payer: {
// 				email: "test@example.com",
// 			},
// 			transaction_amount: 1.0,
// 			description: "Test PIX Payment",
// 		});

// 		return response;
// 	});
