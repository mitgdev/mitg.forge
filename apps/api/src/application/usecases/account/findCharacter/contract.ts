import z from "zod";
import { PlayerSchema } from "@/shared/schemas/Player";

export const AccountFindCharacterContractSchema = {
	input: z.object({
		name: z.string().min(1),
	}),
	output: PlayerSchema.omit({ lastip: true }),
};

export type AccountFindCharacterContractInput = z.infer<
	typeof AccountFindCharacterContractSchema.input
>;
export type AccountFindCharacterContractOutput = z.input<
	typeof AccountFindCharacterContractSchema.output
>;
