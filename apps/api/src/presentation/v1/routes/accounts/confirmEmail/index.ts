import { AccountConfirmEmailContractSchema } from "@/application/usecases/account/confirmEmail/contract";
import { isNotAuthenticatedProcedure } from "@/presentation/procedures/isNotAuthenticated";

export const confirmEmailAccountRoute = isNotAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/confirm-email",
		summary: "Confirm Email",
		successStatus: 201,
		description: "Confirm a user's email address.",
	})
	.input(AccountConfirmEmailContractSchema.input)
	.output(AccountConfirmEmailContractSchema.output)
	.handler(async ({ context, input }) => {
		await context.usecases.account.confirmEmail.execute(input);
	});
