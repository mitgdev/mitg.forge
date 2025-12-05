import z from "zod";

export const AccountTwoFactorConfirmContractSchema = {
	input: z.object({
		token: z.string().min(1).max(6).regex(/^\d+$/),
	}),
	output: z.void(),
};

export type AccountTwoFactorConfirmContractInput = z.infer<
	typeof AccountTwoFactorConfirmContractSchema.input
>;

export type AccountTwoFactorConfirmContractOutput = z.infer<
	typeof AccountTwoFactorConfirmContractSchema.output
>;
