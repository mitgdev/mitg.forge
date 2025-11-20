import z from "zod";

export const AccountDeleteCharacterContractSchema = {
	input: z.object({
		name: z.string().min(4).max(21),
		password: z.string(),
	}),
	output: z.void(),
};

export type AccountDeleteCharacterContractInput = z.infer<
	typeof AccountDeleteCharacterContractSchema.input
>;

export type AccountDeleteCharacterContractOutput = z.infer<
	typeof AccountDeleteCharacterContractSchema.output
>;
