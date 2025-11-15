import { AccountLogoutContractSchema } from "@/application/usecases/account/logout/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const logoutRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/logout",
		summary: "Logout",
		successStatus: 204,
		description: "Logout a user and invalidate the session token.",
	})
	.input(AccountLogoutContractSchema.input)
	.output(AccountLogoutContractSchema.output)
	.handler(async ({ context }) => {
		await context.usecases.account.logout.execute();
	});
