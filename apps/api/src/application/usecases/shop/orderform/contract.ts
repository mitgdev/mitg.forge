import z from "zod";
import { ShopOrderForm } from "@/shared/schemas/ShopOrderForm";

export const ShopOrderFormContractSchema = {
	input: z.unknown(),
	output: ShopOrderForm,
};

export type ShopOrderFormContractInput = z.infer<
	typeof ShopOrderFormContractSchema.input
>;
export type ShopOrderFormContractOutput = z.infer<
	typeof ShopOrderFormContractSchema.output
>;
