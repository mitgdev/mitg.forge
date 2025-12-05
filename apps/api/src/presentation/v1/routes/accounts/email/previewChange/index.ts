import { AccountPreviewEmailChangeContractSchema } from "@/application/usecases/account/previewEmailChange/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const previewEmailChangeRoute = isAuthenticatedProcedure
	.route({
		method: "GET",
		path: "/{token}/preview-change",
		summary: "Preview Email Change",
		successStatus: 200,
		description: "Preview a change email for the authenticated user's account.",
	})
	.input(AccountPreviewEmailChangeContractSchema.input)
	.output(AccountPreviewEmailChangeContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.account.previewEmailChange.execute(input);
	});
