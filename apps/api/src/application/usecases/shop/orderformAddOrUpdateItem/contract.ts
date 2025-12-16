import z from "zod";
import { ShopOrderForm } from "@/shared/schemas/ShopOrderForm";

export const ShopOrderFormAddOrUpdateItemContractSchema = {
	input: z.object({
		productId: z.uuid(),
		quantity: z.number().min(1),
		mode: z.enum(["SET", "ADD"]).default("ADD").optional(),
	}),
	output: ShopOrderForm,
};

export type ShopOrderFormAddOrUpdateItemContractInput = z.infer<
	typeof ShopOrderFormAddOrUpdateItemContractSchema.input
>;
export type ShopOrderFormAddOrUpdateItemContractOutput = z.infer<
	typeof ShopOrderFormAddOrUpdateItemContractSchema.output
>;
