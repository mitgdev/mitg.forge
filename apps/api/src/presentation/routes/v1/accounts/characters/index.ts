import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";
import { AccountCharactersSchema } from "./schema";

export const charactersRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/characters",
		summary: "Get Account Details",
		description:
			"Retrieve detailed information about the authenticated user's account.",
	})
	.input(AccountCharactersSchema.input)
	.output(AccountCharactersSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.charactersBySession.execute(input);
	});
