import { publicProcedure } from "@/presentation/procedures/public";
import { SessionInfoSchema } from "./schema";

export const infoRoute = publicProcedure
	.route({
		method: "POST",
		path: "/info",
		summary: "Info",
		description: "Retrieve information about the current session.",
	})
	.input(SessionInfoSchema.input)
	.output(SessionInfoSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.session.info.execute();
	});
