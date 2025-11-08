import { AccountCharactersContractSchema } from "@/application/usecases/account/characters/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const charactersRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/characters",
		summary: "Get Account Details",
		description:
			"Retrieve detailed information about the authenticated user's account.",
	})
	.input(AccountCharactersContractSchema.input)
	.output(AccountCharactersContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.charactersBySession.execute(input);
	});
