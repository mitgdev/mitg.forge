import { base } from "@/infra/rpc/base";
import { mercadopagoPaymentRoute } from "./payment";
import { mercadopagoWebhookRoute } from "./webhook";

export const mercadoPagoRouter = base.prefix("/mercadopago").router({
	webhook: mercadopagoWebhookRoute,
	payment: mercadopagoPaymentRoute,
});
