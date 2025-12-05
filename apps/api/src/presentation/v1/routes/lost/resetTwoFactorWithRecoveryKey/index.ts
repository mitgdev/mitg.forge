import { LostAccountResetTwoFactorWithRecoveryKeyContractSchema } from "@/application/usecases/lostAccount/resetTwoFactorWithRecoveryKey/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const resetTwoFactorWithRecoveryKeyRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/account/2fa/recovery_key/reset",
		successStatus: 204,
		summary: "Reset Account Two-Factor Authentication with Recovery Key",
		description:
			"Resets the account two-factor authentication using a valid recovery key when two-factor authentication is enabled.",
	})
	.input(LostAccountResetTwoFactorWithRecoveryKeyContractSchema.input)
	.output(LostAccountResetTwoFactorWithRecoveryKeyContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.resetTwoFactorWithRecoveryKey.execute(
			input,
		);
	});
