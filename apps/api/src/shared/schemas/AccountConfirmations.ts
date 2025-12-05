import {
	MiforgeAccountConfirmationChannel,
	MiforgeAccountConfirmationType,
} from "generated/client";
import z from "zod";

export const AccountConfirmation = z.object({
	id: z.number(),
	type: z.enum(MiforgeAccountConfirmationType),
	channel: z.enum(MiforgeAccountConfirmationChannel),
	token: z.string(),
	value: z.string().nullable(),
	expires_at: z.date(),
	confirmed_at: z.date().nullable(),
	canceled_at: z.date().nullable(),
	attempts: z.number(),
	max_attempts: z.number(),
	last_attempt_at: z.date().nullable(),
	accountId: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
});

export type AccountConfirmation = z.infer<typeof AccountConfirmation>;
