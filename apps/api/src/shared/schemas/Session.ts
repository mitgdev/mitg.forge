import z from "zod";

export const SessionSchema = z.object({
	id: z.number(),
	token: z.string(),
	expires_at: z.date(),
	ip: z.string().nullable(),
	protocol: z.string().nullable(),
	accountId: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
});
