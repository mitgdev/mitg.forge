import { AccountEditCharacterContractSchema } from "@/application/usecases/account/editCharacter/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const editByNameCharacterRoute = isAuthenticatedProcedure
	.route({
		method: "PATCH",
		path: "/character/{name}",
		summary: "Edit character by name",
		successStatus: 204,
		description:
			"Edit a character by name associated with the authenticated user's account.",
	})
	.input(AccountEditCharacterContractSchema.input)
	.output(AccountEditCharacterContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.editCharacter.execute(input);
	});
