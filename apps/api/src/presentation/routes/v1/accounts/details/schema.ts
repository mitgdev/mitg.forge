import z from "zod";
import { AccountSchema } from "@/domain/schemas/Account";
import { PlayerSchema } from "@/domain/schemas/Player";
import { SessionSchema } from "@/domain/schemas/Session";
import { StoreHistory } from "@/domain/schemas/StoreHistory";

export const AccountDetailsSchema = {
	input: z.unknown().optional(),
	output: AccountSchema.omit({ password: true }).extend({
		store_history: z.array(StoreHistory),
		sessions: z.array(SessionSchema.omit({ token: true })),
		players: z.array(PlayerSchema),
	}),
};

export type AccountDetailsInput = z.infer<typeof AccountDetailsSchema.input>;
export type AccountDetailsOutput = z.input<typeof AccountDetailsSchema.output>;
