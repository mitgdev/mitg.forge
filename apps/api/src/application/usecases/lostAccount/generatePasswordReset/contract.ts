import z from "zod";

export const LostAccountGeneratePasswordResetContractSchema = {
	input: z.object({
		email: z.email("Invalid email address").max(60),
	}),
	output: z.void(),
};

export type LostAccountGeneratePasswordResetContractInput = z.infer<
	typeof LostAccountGeneratePasswordResetContractSchema.input
>;

export type LostAccountGeneratePasswordResetContractOutput = z.infer<
	typeof LostAccountGeneratePasswordResetContractSchema.output
>;
