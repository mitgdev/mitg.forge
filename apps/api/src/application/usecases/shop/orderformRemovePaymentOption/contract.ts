import z from "zod";
import { ShopOrderForm } from "@/shared/schemas/ShopOrderForm";

export const ShopOrderFormRemovePaymentOptionContractSchema = {
	input: z.undefined(),
	output: ShopOrderForm,
};

export type ShopOrderFormRemovePaymentOptionContractInput = z.infer<
	typeof ShopOrderFormRemovePaymentOptionContractSchema.input
>;
export type ShopOrderFormRemovePaymentOptionContractOutput = z.infer<
	typeof ShopOrderFormRemovePaymentOptionContractSchema.output
>;
