import z from "zod";

export const LostAccountFindByEmailOrCharacterNameContractSchema = {
	input: z.object({
		email: z.email("Invalid email address").max(60),
	}),
	output: z.void(),
};

export type LostAccountFindByEmailOrCharacterNameContractInput = z.infer<
	typeof LostAccountFindByEmailOrCharacterNameContractSchema.input
>;

export type LostAccountFindByEmailOrCharacterNameContractOutput = z.infer<
	typeof LostAccountFindByEmailOrCharacterNameContractSchema.output
>;
