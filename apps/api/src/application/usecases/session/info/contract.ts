import z from "zod";

export const SessionInfoContractSchema = {
	input: z.undefined(),
	output: z.object({
		authenticated: z.boolean(),
		session: z
			.object({
				token: z.string(),
				email: z.email(),
			})
			.nullable(),
	}),
};

export type SessionInfoContractInput = z.infer<
	typeof SessionInfoContractSchema.input
>;
export type SessionInfoContractOutput = z.infer<
	typeof SessionInfoContractSchema.output
>;
