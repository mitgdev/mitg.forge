import { AccountCreateContractSchema } from "@/application/usecases/account/create/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const createAccountRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/create",
		summary: "Create Account",
		successStatus: 201,
		description: "Create a new user account.",
	})
	.input(AccountCreateContractSchema.input)
	.output(AccountCreateContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.account.create.execute(input);
	});
