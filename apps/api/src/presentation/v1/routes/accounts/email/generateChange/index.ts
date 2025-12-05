import { AccountGenerateEmailChangeContractSchema } from "@/application/usecases/account/generateEmailChange/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const generateChangeEmailRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/generate-change",
		summary: "Generate Change Email",
		successStatus: 204,
		description:
			"Generate a change email for the authenticated user's account.",
	})
	.input(AccountGenerateEmailChangeContractSchema.input)
	.output(AccountGenerateEmailChangeContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.generateEmailChange.execute(input);
	});
