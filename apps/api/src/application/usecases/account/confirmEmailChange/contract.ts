import z from "zod";

export const AccountConfirmEmailChangeContractSchema = {
	input: z.object({
		token: z.string().min(1).max(512),
	}),
	output: z.object({
		newEmail: z.email(),
	}),
};

export type AccountConfirmEmailChangeContractInput = z.infer<
	typeof AccountConfirmEmailChangeContractSchema.input
>;

export type AccountConfirmEmailChangeContractOutput = z.infer<
	typeof AccountConfirmEmailChangeContractSchema.output
>;
