import z from "zod";

export const AccountTwoFactorSetupContractSchema = {
	input: z.object({
		recoveryKey: z.string().min(1).max(23),
	}),
	output: z.object({
		uri: z.string(),
	}),
};

export type AccountTwoFactorSetupInput = z.infer<
	typeof AccountTwoFactorSetupContractSchema.input
>;

export type AccountTwoFactorSetupOutput = z.infer<
	typeof AccountTwoFactorSetupContractSchema.output
>;
