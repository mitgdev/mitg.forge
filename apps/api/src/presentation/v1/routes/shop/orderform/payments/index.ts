import { base } from "@/infra/rpc/base";
import { orderFormRemovePaymentRoute } from "./removePayment";
import { orderFormSetPaymentRoute } from "./setPayment";

export const orderFormPaymentsRouter = base.prefix("/payments").router({
	setPayment: orderFormSetPaymentRoute,
	removePayment: orderFormRemovePaymentRoute,
});
