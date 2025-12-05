import z from "zod";

export const AccountGenerateEmailChangeContractSchema = {
	input: z.object({
		newEmail: z.email(),
	}),
	output: z.void(),
};

export type AccountGenerateEmailChangeContractInput = z.infer<
	typeof AccountGenerateEmailChangeContractSchema.input
>;

export type AccountGenerateEmailChangeContractOutput = z.infer<
	typeof AccountGenerateEmailChangeContractSchema.output
>;
