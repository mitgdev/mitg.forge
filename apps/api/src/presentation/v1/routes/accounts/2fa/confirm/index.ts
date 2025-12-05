import { AccountTwoFactorConfirmContractSchema } from "@/application/usecases/account/twoFactorConfirm/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const twoFactorConfirmRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/confirm",
		summary: "Confirm two-factor authentication setup",
		description:
			"Confirm two-factor authentication setup for the authenticated user's account.",
	})
	.input(AccountTwoFactorConfirmContractSchema.input)
	.output(AccountTwoFactorConfirmContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.twoFactorConfirm.execute(input);
	});
