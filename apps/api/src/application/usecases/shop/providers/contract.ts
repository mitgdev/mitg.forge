import z from "zod";

import { ShopProvider } from "@/shared/schemas/ShopProvider";

export const ShopProvidersContractSchema = {
	input: z.unknown(),
	output: z.array(ShopProvider),
};

export type ShopProvidersContractInput = z.infer<
	typeof ShopProvidersContractSchema.input
>;
export type ShopProvidersContractOutput = z.infer<
	typeof ShopProvidersContractSchema.output
>;
