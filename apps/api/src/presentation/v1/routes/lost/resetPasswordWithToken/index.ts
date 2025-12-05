import { LostAccountResetPasswordWithTokenContractSchema } from "@/application/usecases/lostAccount/resetPasswordWithToken/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const resetPasswordWithTokenRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/account/password/token/reset",
		successStatus: 204,
		summary: "Reset Password With Token",
		description:
			"Resets the password for the account associated with the provided token.",
	})
	.input(LostAccountResetPasswordWithTokenContractSchema.input)
	.output(LostAccountResetPasswordWithTokenContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.resetPasswordWithToken.execute(input);
	});
