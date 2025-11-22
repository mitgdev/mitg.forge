import z from "zod";
import { MiforgeConfigSchema } from "@/shared/schemas/Config";

export const ConfigUpdateContractSchema = {
	input: MiforgeConfigSchema.partial(),
	output: z.void(),
};

export type ConfigUpdateContractInput = z.infer<
	typeof ConfigUpdateContractSchema.input
>;

export type ConfigUpdateContractOutput = z.infer<
	typeof ConfigUpdateContractSchema.output
>;
