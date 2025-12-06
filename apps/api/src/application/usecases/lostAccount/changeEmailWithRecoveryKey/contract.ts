import z from "zod";

export const LostAccountChangeEmailWithRecoveryKeyContractSchema = {
	input: z
		.object({
			oldEmail: z.email(),
			newEmail: z.email(),
			recoveryKey: z.string().min(1).max(23),
			token: z.string().max(6).optional(),
		})
		.superRefine(({ newEmail, oldEmail }, ctx) => {
			if (newEmail === oldEmail) {
				ctx.addIssue({
					code: "custom",
					message: "New email must be different from old email",
					path: ["newEmail"],
				});
			}
		}),
	output: z.void(),
};

export type LostAccountChangeEmailWithRecoveryKeyContractInput = z.infer<
	typeof LostAccountChangeEmailWithRecoveryKeyContractSchema.input
>;

export type LostAccountChangeEmailWithRecoveryKeyContractOutput = z.infer<
	typeof LostAccountChangeEmailWithRecoveryKeyContractSchema.output
>;
