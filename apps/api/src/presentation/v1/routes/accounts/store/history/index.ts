import { AccountStoreHistoryContractSchema } from "@/application/usecases/account/storeHistory/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const storeHistoryRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/history",
		summary: "Store History",
		description:
			"Retrieve a list of store purchase history associated with the authenticated user's account.",
	})
	.input(AccountStoreHistoryContractSchema.input)
	.output(AccountStoreHistoryContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.storeHistory.execute(input);
	});
