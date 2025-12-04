import { AccountTwoFactorSetupContractSchema } from "@/application/usecases/account/twoFactorSetup/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const twoFactorSetupRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/setup",
		summary: "Setup two-factor authentication",
		description:
			"Setup two-factor authentication for the authenticated user's account.",
	})
	.input(AccountTwoFactorSetupContractSchema.input)
	.output(AccountTwoFactorSetupContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.twoFactorSetup.execute(input);
	});
