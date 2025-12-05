import { LostAccountFindByEmailOrCharacterNameContractSchema } from "@/application/usecases/lostAccount/findByEmailOrCharacterName/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const findByEmailOrCharacterNameRoute = isNotAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/account/{email}",
		successStatus: 204,
		summary: "Verify Account by Email",
		description:
			"Allows users to initiate the account recovery process by providing their registered email address.",
	})
	.input(LostAccountFindByEmailOrCharacterNameContractSchema.input)
	.output(LostAccountFindByEmailOrCharacterNameContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.findByEmailOrCharacterName.execute(
			input,
		);
	});
