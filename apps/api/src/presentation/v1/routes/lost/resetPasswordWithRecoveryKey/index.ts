import { LostAccountResetPasswordWithRecoveryKeyContractSchema } from "@/application/usecases/lostAccount/resetPasswordWithRecoveryKey/contract";

import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const resetPasswordWithRecoveryKeyRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/account/password/recovery_key/reset",
		successStatus: 204,
		summary: "Reset Password With Recovery Key",
		description:
			"Resets the password for the account associated with the provided recovery key.",
	})
	.input(LostAccountResetPasswordWithRecoveryKeyContractSchema.input)
	.output(LostAccountResetPasswordWithRecoveryKeyContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.resetPasswordWithRecoveryKey.execute(
			input,
		);
	});
