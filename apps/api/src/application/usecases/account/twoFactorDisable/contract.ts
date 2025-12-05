import z from "zod";

export const AccountTwoFactorDisableContractSchema = {
	input: z.object({
		token: z.string().min(1).max(6).regex(/^\d+$/),
	}),
	output: z.void(),
};

export type AccountTwoFactorDisableContractInput = z.infer<
	typeof AccountTwoFactorDisableContractSchema.input
>;

export type AccountTwoFactorDisableContractOutput = z.infer<
	typeof AccountTwoFactorDisableContractSchema.output
>;
