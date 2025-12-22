import z from "zod";
import { ShopOrderForm } from "@/shared/schemas/ShopOrderForm";

export const ShopOrderFormSetPaymentOptionContractSchema = {
	input: z.object({
		paymentOptionId: z.uuid(),
	}),
	output: ShopOrderForm,
};

export type ShopOrderFormSetPaymentOptionContractInput = z.infer<
	typeof ShopOrderFormSetPaymentOptionContractSchema.input
>;
export type ShopOrderFormSetPaymentOptionContractOutput = z.infer<
	typeof ShopOrderFormSetPaymentOptionContractSchema.output
>;
