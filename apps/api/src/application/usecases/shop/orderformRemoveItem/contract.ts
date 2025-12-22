import z from "zod";
import { ShopOrderForm } from "@/shared/schemas/ShopOrderForm";

export const ShopOrderFormRemoveItemContractSchema = {
	input: z.object({
		itemId: z.uuid(),
	}),
	output: ShopOrderForm,
};

export type ShopOrderFormRemoveItemContractInput = z.infer<
	typeof ShopOrderFormRemoveItemContractSchema.input
>;
export type ShopOrderFormRemoveItemContractOutput = z.infer<
	typeof ShopOrderFormRemoveItemContractSchema.output
>;
