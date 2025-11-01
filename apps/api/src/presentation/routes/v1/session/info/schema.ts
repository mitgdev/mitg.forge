import z from "zod";

export const SessionInfoSchema = {
	input: z.undefined(),
	output: z.object({
		accountId: z.number(),
		token: z.string(),
		email: z.email(),
	}),
};

export type SessionInfoInput = z.infer<typeof SessionInfoSchema.input>;
export type SessionInfoOutput = z.infer<typeof SessionInfoSchema.output>;
