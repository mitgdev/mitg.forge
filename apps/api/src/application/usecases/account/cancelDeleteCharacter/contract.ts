import z from "zod";

export const AccountCancelDeleteCharacterContractSchema = {
	input: z.object({
		name: z.string().min(1).max(21),
	}),
	output: z.void(),
};

export type AccountCancelDeleteCharacterContractInput = z.infer<
	typeof AccountCancelDeleteCharacterContractSchema.input
>;

export type AccountCancelDeleteCharacterContractOutput = z.infer<
	typeof AccountCancelDeleteCharacterContractSchema.output
>;
