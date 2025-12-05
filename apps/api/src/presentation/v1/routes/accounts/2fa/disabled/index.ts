import { AccountTwoFactorDisableContractSchema } from "@/application/usecases/account/twoFactorDisable/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const twoFactorDisableRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/disable",
		summary: "Disable two-factor authentication",
		description:
			"Disable two-factor authentication for the authenticated user's account.",
	})
	.input(AccountTwoFactorDisableContractSchema.input)
	.output(AccountTwoFactorDisableContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.twoFactorDisable.execute(input);
	});
