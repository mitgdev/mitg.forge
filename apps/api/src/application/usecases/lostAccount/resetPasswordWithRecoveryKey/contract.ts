import { passwordSchema } from "@miforge/core/schemas";
import z from "zod";

export const LostAccountResetPasswordWithRecoveryKeyContractSchema = {
	input: z
		.object({
			email: z.email(),
			recoveryKey: z.string().min(1).max(23),
			newPassword: passwordSchema,
			confirmNewPassword: passwordSchema,
		})
		.superRefine(({ confirmNewPassword, newPassword }, ctx) => {
			if (confirmNewPassword === newPassword) return;

			ctx.addIssue({
				code: "custom",
				message: "New password and confirm password do not match",
				path: ["confirmNewPassword"],
			});
		}),
	output: z.void(),
};

export type LostAccountResetPasswordWithRecoveryKeyContractInput = z.infer<
	typeof LostAccountResetPasswordWithRecoveryKeyContractSchema.input
>;

export type LostAccountResetPasswordWithRecoveryKeyContractOutput = z.infer<
	typeof LostAccountResetPasswordWithRecoveryKeyContractSchema.output
>;
