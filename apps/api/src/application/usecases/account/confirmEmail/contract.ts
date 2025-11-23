import z from "zod";

export const AccountConfirmEmailContractSchema = {
	input: z.object({
		email: z.email(),
		token: z.string().max(512),
	}),
	output: z.void(),
};

export type AccountConfirmEmailContractInput = z.infer<
	typeof AccountConfirmEmailContractSchema.input
>;

export type AccountConfirmEmailContractOutput = z.infer<
	typeof AccountConfirmEmailContractSchema.output
>;
