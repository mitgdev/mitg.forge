import z from "zod";
import { AccountSchema } from "@/shared/schemas/Account";
import { PlayerSchema } from "@/shared/schemas/Player";
import { SessionSchema } from "@/shared/schemas/Session";
import { StoreHistory } from "@/shared/schemas/StoreHistory";

export const AccountDetailsSchema = {
	input: z.unknown().optional(),
	output: AccountSchema.omit({ password: true }).extend({
		store_history: z.array(StoreHistory),
		sessions: z.array(SessionSchema.omit({ token: true })),
		characters: z.array(PlayerSchema),
	}),
};

export type AccountDetailsInput = z.infer<typeof AccountDetailsSchema.input>;
export type AccountDetailsOutput = z.input<typeof AccountDetailsSchema.output>;
