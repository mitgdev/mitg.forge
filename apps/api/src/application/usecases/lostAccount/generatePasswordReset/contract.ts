import z from "zod";

export const LostAccountGeneratePasswordResetContractSchema = {
	input: z.object({
		emailOrCharacterName: z.union([
			z.string().min(4, "Character name must be at least 4 characters").max(21),
			z.email("Invalid email address").max(60),
		]),
	}),
	output: z.void(),
};

export type LostAccountGeneratePasswordResetContractInput = z.infer<
	typeof LostAccountGeneratePasswordResetContractSchema.input
>;

export type LostAccountGeneratePasswordResetContractOutput = z.infer<
	typeof LostAccountGeneratePasswordResetContractSchema.output
>;
