import { AccountConfirmEmailChangeContractSchema } from "@/application/usecases/account/confirmEmailChange/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const confirmEmailChangeRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/{token}/confirm-change",
		summary: "Confirm Email Change",
		successStatus: 200,
		description: "Confirm a change email for the authenticated user's account.",
	})
	.input(AccountConfirmEmailChangeContractSchema.input)
	.output(AccountConfirmEmailChangeContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.confirmEmailChange.execute(input);
	});
