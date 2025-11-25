import z from "zod";

export const ChangePasswordWithOldContractSchema = {
	input: z
		.object({
			oldPassword: z.string().max(100),
			newPassword: z
				.string()
				.min(8)
				.max(100)
				.regex(/[A-Z]/, {
					message: "Password must contain at least one uppercase letter",
				})
				.regex(/[\W_]/, {
					message: "Password must contain at least one special character",
				}),
			confirmPassword: z.string().max(100),
		})
		.superRefine(({ confirmPassword, newPassword }, ctx) => {
			if (confirmPassword === newPassword) return;

			ctx.addIssue({
				code: "custom",
				message: "New password and confirm password do not match",
				path: ["confirmPassword"],
			});
		}),
	output: z.void(),
};

export type ChangePasswordWithOldContractInput = z.infer<
	typeof ChangePasswordWithOldContractSchema.input
>;

export type ChangePasswordWithOldContractOutput = z.infer<
	typeof ChangePasswordWithOldContractSchema.output
>;
