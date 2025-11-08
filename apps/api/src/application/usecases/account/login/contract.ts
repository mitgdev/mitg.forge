import z from "zod";

export const AccountLoginContractSchema = {
	input: z.object({
		email: z.email(),
		password: z.string().min(1),
	}),
	output: z.object({
		token: z.string(),
	}),
};

export type AccountLoginContractInput = z.infer<
	typeof AccountLoginContractSchema.input
>;
export type AccountLoginContractOutput = z.infer<
	typeof AccountLoginContractSchema.output
>;
