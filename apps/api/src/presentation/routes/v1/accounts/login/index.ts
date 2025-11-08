import { AccountLoginContractSchema } from "@/application/usecases/account/login/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const loginRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/login",
		summary: "Login",
		description: "Authenticate a user and return a session token.",
	})
	.input(AccountLoginContractSchema.input)
	.output(AccountLoginContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.login.execute(input);
	});
