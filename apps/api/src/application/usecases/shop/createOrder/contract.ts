import z from "zod";
import { ShopOrder } from "@/shared/schemas/ShopOrder";

export const ShopCreateOrderContractSchema = {
	input: z.object({
		serviceId: z.number(),
		providerId: z.number(),
	}),
	output: ShopOrder,
};

export type ShopCreateOrderContractInput = z.infer<
	typeof ShopCreateOrderContractSchema.input
>;

export type ShopCreateOrderContractOutput = z.infer<
	typeof ShopCreateOrderContractSchema.output
>;
