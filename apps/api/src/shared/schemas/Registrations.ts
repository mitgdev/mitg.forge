import z from "zod";

export const RegistrationKeySchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	street: z.string(),
	number: z.string(),
	postal: z.string(),
	city: z.string(),
	country: z.string(),
	state: z.string(),
	additional: z.string().nullable(),
	phone: z.string().nullable(),
	recoveryKey: z.string().nullable(),
	accountId: z.number(),
	created_at: z.date(),
	updated_at: z.date(),
});
