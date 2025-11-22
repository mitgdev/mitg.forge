import z from "zod";
import { MiforgeConfigSchema } from "@/shared/schemas/Config";

export const ConfigInfoContractSchema = {
	input: z.unknown(),
	output: MiforgeConfigSchema,
};

export type ConfigInfoContractInput = z.infer<
	typeof ConfigInfoContractSchema.input
>;

export type ConfigInfoContractOutput = z.infer<
	typeof ConfigInfoContractSchema.output
>;
