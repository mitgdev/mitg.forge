import { passwordSchema } from "@miforge/core/schemas";
import z from "zod";

export const LostAccountResetPasswordWithTokenContractSchema = {
	input: z
		.object({
			token: z.string().min(1).max(512),
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

export type LostAccountResetPasswordWithTokenContractInput = z.infer<
	typeof LostAccountResetPasswordWithTokenContractSchema.input
>;

export type LostAccountResetPasswordWithTokenContractOutput = z.infer<
	typeof LostAccountResetPasswordWithTokenContractSchema.output
>;
