import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";
import { SessionInfoSchema } from "./schema";

export const infoRoute = isAuthenticatedProcedure
	.route({
		method: "POST",
		path: "/info",
		summary: "Info",
		description: "Retrieve information about the current session.",
	})
	.input(SessionInfoSchema.input)
	.output(SessionInfoSchema.output)
	.handler(async ({ context }) => {
		return context.services.session.info();
	});
