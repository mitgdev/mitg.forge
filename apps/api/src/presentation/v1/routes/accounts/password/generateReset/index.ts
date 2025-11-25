import { AccountGeneratePasswordResetContractSchema } from "@/application/usecases/account/generatePasswordReset/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const generatePasswordResetRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/generate-reset",
		summary: "Generate Password Reset",
		successStatus: 204,
		description: "Generate a password reset token for a user.",
	})
	.input(AccountGeneratePasswordResetContractSchema.input)
	.output(AccountGeneratePasswordResetContractSchema.output)
	.handler(async ({ context }) => {
		await context.usecases.account.generatePasswordReset.execute();
	});
