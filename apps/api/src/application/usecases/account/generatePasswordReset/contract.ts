import z from "zod";

export const AccountGeneratePasswordResetContractSchema = {
	input: z.unknown(),
	output: z.void(),
};

export type AccountGeneratePasswordResetContractInput = z.infer<
	typeof AccountGeneratePasswordResetContractSchema.input
>;

export type AccountGeneratePasswordResetContractOutput = z.infer<
	typeof AccountGeneratePasswordResetContractSchema.output
>;
