import z from "zod";

export const AccountCreateCharacterContractSchema = {
	input: z.object({
		name: z.string().min(4).max(21),
		vocation: z.enum(["Sorcerer", "Druid", "Paladin", "Knight", "Monk"]),
		gender: z.enum(["Male", "Female"]),
		worldId: z.number().int().positive().max(1000),
	}),
	output: z.void(),
};

export type AccountCreateCharacterContractInput = z.infer<
	typeof AccountCreateCharacterContractSchema.input
>;
export type AccountCreateCharacterContractOutput = z.infer<
	typeof AccountCreateCharacterContractSchema.output
>;
