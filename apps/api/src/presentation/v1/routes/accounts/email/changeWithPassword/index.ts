import { AccountChangeEmailWithPasswordContractSchema } from "@/application/usecases/account/changeEmailWithPassword/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const changeEmailWithPasswordRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/change-with-password",
		summary: "Change Account Email with Password",
		successStatus: 204,
		description:
			"Change the email address of the authenticated user's account using their password.",
	})
	.input(AccountChangeEmailWithPasswordContractSchema.input)
	.output(AccountChangeEmailWithPasswordContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.changeEmailWithPassword.execute(input);
	});
