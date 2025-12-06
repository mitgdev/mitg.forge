import z from "zod";

export const ListAccountSchema = z.object({
	id: z.number(),
	name: z.string().nullable(),
	email: z.email(),
	type: z.number(),
});
