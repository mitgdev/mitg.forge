import { base } from "@/infra/rpc/base";
import { mercadoPagoRouter } from "./mercadopago";

export const paymentsRouter = base.tag("Payments").prefix("/payments").router({
	mercadopago: mercadoPagoRouter,
});
