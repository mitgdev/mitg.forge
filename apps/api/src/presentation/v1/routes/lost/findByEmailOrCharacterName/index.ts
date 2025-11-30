import { LostAccountFindByEmailOrCharacterNameContractSchema } from "@/application/usecases/lostAccount/findByEmailOrCharacterName/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const findByEmailOrCharacterNameRoute = isNotAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/account/{emailOrCharacterName}",
		successStatus: 204,
		summary: "Find lost account by email or character name",
		description:
			"Allows users to initiate the account recovery process by providing either their registered email address or character name.",
	})
	.input(LostAccountFindByEmailOrCharacterNameContractSchema.input)
	.output(LostAccountFindByEmailOrCharacterNameContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.findByEmailOrCharacterName.execute(
			input,
		);
	});
