import { LostAccountChangeEmailWithRecoveryKeyContractSchema } from "@/application/usecases/lostAccount/changeEmailWithRecoveryKey/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const changeEmailWithRecoveryKeyRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/account/email/recovery_key/change",
		successStatus: 204,
		summary: "Change Email With Recovery Key",
		description:
			"Changes the email for the account associated with the provided recovery key.",
	})
	.input(LostAccountChangeEmailWithRecoveryKeyContractSchema.input)
	.output(LostAccountChangeEmailWithRecoveryKeyContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.changeEmailWithRecoveryKey.execute(
			input,
		);
	});
