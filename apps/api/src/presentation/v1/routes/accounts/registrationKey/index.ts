import { AccountRegistrationKeyContractSchema } from "@/application/usecases/account/registration/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const accountRegistrationKey = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/registration-key",
		summary: "Registration Key",
		successStatus: 200,
		description: "Generate or retrieve the registration key for an account.",
	})
	.input(AccountRegistrationKeyContractSchema.input)
	.output(AccountRegistrationKeyContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.registrationKey.execute(input);
	});
