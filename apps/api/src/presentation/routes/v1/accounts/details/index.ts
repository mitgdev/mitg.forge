import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";
import { AccountDetailsSchema } from "./schema";

export const detailsRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/details",
		summary: "Get Account Details",
		description:
			"Retrieve detailed information about the authenticated user's account.",
	})
	.input(AccountDetailsSchema.input)
	.output(AccountDetailsSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.account.details.execute();
	});
