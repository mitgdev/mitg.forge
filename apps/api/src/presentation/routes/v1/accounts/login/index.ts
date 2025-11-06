import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";
import { AccountLoginSchema } from "./schema";

export const loginRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/login",
		summary: "Login",
		description: "Authenticate a user and return a session token.",
	})
	.input(AccountLoginSchema.input)
	.output(AccountLoginSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.login.execute(input);
	});
