import { SessionInfoContractSchema } from "@/application/usecases/session/info/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const infoRoute = publicProcedure
	.route({
		method: "POST",
		path: "/info",
		summary: "Info",
		description: "Retrieve information about the current session.",
	})
	.input(SessionInfoContractSchema.input)
	.output(SessionInfoContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.session.info.execute();
	});
