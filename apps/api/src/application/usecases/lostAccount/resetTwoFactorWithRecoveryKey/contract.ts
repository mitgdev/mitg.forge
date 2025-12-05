import z from "zod";

export const LostAccountResetTwoFactorWithRecoveryKeyContractSchema = {
	input: z.object({
		email: z.email(),
		recoveryKey: z.string().min(1).max(23),
	}),
	output: z.void(),
};

export type LostAccountResetTwoFactorWithRecoveryKeyContractInput = z.infer<
	typeof LostAccountResetTwoFactorWithRecoveryKeyContractSchema.input
>;

export type LostAccountResetTwoFactorWithRecoveryKeyContractOutput = z.infer<
	typeof LostAccountResetTwoFactorWithRecoveryKeyContractSchema.output
>;
