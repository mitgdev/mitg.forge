import { LostAccountVerifyConfirmationTokenContractSchema } from "@/application/usecases/lostAccount/verifyConfirmationToken/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const validConfirmationTokenRoute = isNotAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/account/confirmation/{token}",
		summary: "Validate Confirmation Token",
		description:
			"Validates the confirmation token sent to the user's email during the account recovery process.",
	})
	.input(LostAccountVerifyConfirmationTokenContractSchema.input)
	.output(LostAccountVerifyConfirmationTokenContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.lostAccount.validateConfirmationToken.execute(
			input,
		);
	});
