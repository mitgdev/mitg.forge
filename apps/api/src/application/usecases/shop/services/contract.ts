import z from "zod";
import { ShopService } from "@/shared/schemas/ShopService";

export const ShopServicesContractSchema = {
	input: z.unknown(),
	output: z.array(ShopService),
};

export type ShopServicesContractInput = z.infer<
	typeof ShopServicesContractSchema.input
>;
export type ShopServicesContractOutput = z.infer<
	typeof ShopServicesContractSchema.output
>;
