import { AccountDeleteCharacterContractSchema } from "@/application/usecases/account/deleteCharacter/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const deleteCharacterRoute = isAuthenticatedProcedure
	.route({
		method: "DELETE",
		path: "/character/{name}",
		summary: "Delete character",
		successStatus: 200,
		description:
			"Delete a character by name associated with the authenticated user's account.",
	})
	.input(AccountDeleteCharacterContractSchema.input)
	.output(AccountDeleteCharacterContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.deleteCharacter.execute(input);
	});
