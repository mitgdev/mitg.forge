import z from "zod";
import { AccountSchema } from "@/shared/schemas/Account";
import { PlayerSchema } from "@/shared/schemas/Player";
import { SessionSchema } from "@/shared/schemas/Session";
import { StoreHistory } from "@/shared/schemas/StoreHistory";

export const AccountDetailsContractSchema = {
	input: z.unknown().optional(),
	output: AccountSchema.omit({ password: true }).extend({
		store_history: z.array(StoreHistory),
		sessions: z.array(SessionSchema.omit({ token: true })),
		characters: z.array(PlayerSchema),
	}),
};

export type AccountDetailsContractInput = z.infer<
	typeof AccountDetailsContractSchema.input
>;
export type AccountDetailsContractOutput = z.input<
	typeof AccountDetailsContractSchema.output
>;
