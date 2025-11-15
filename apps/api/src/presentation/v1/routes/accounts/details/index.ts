import { AccountDetailsContractSchema } from "@/application/usecases/account/details/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const detailsRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/details",
		summary: "Details",
		description:
			"Retrieve detailed information about the authenticated user's account.",
	})
	.input(AccountDetailsContractSchema.input)
	.output(AccountDetailsContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.account.detailsBySession.execute();
	});
