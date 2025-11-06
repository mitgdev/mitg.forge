import z from "zod";

export const TibiaClientErrorSchema = z.object({
	errorCode: z.union([
		z.literal(3), // common error
		z.literal(6), // two-factor by app/token
		z.literal(7), // client is too old
		z.literal(8), // two-factor by email
		z.literal(11), // suspicious login, code sent to email
	]),
	errorMessage: z.string(),
});

export type TibiaClientError = z.infer<typeof TibiaClientErrorSchema>;
