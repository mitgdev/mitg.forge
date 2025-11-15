import { AccountCharactersContractSchema } from "@/application/usecases/account/characters/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const charactersRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/characters",
		summary: "Characters",
		description:
			"Retrieve a list of characters associated with the authenticated user's account.",
	})
	.input(AccountCharactersContractSchema.input)
	.output(AccountCharactersContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.charactersBySession.execute(input);
	});
