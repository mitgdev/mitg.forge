import { AccountFindCharacterContractSchema } from "@/application/usecases/account/findCharacter/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const findByNameCharacterRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/character/{name}",
		summary: "Find character by name",
		successStatus: 200,
		description:
			"Retrieve a character by name associated with the authenticated user's account.",
	})
	.input(AccountFindCharacterContractSchema.input)
	.output(AccountFindCharacterContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.findCharacterByName.execute(input);
	});
