import { AccountCreateCharacterContractSchema } from "@/application/usecases/account/createCharacter/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const createCharacterRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/characters",
		summary: "Create character",
		successStatus: 201,
		description:
			"Retrieve a list of characters associated with the authenticated user's account.",
	})
	.input(AccountCreateCharacterContractSchema.input)
	.output(AccountCreateCharacterContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.account.createCharacter.execute(input);
	});
