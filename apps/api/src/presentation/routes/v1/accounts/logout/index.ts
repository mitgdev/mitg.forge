import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";
import { AccountLogoutSchema } from "./schema";

export const logoutRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/logout",
		summary: "Logout",
		successStatus: 204,
		description: "Logout a user and invalidate the session token.",
	})
	.input(AccountLogoutSchema.input)
	.output(AccountLogoutSchema.output)
	.handler(async ({ context }) => {
		await context.usecases.account.logout.execute();
	});
