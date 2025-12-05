import { LostAccountGeneratePasswordResetContractSchema } from "@/application/usecases/lostAccount/generatePasswordReset/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const generatePasswordResetRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/account/password/token/generate",
		successStatus: 204,
		summary: "Generate Password Reset",
		description:
			"Generates a password reset request for the account associated with the provided email or character name.",
	})
	.input(LostAccountGeneratePasswordResetContractSchema.input)
	.output(LostAccountGeneratePasswordResetContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.lostAccount.generatePasswordReset.execute(input);
	});
