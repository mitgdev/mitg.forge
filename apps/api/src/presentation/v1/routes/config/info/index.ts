import { ConfigInfoContractSchema } from "@/application/usecases/config/info/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const configInfoRouter = publicProcedure
	.route({
		method: "GET",
		path: "/",
		summary: "Configuration Info",
		description:
			"Retrieves the current configuration information of the application.",
	})
	.output(ConfigInfoContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.config.info.execute();
	});
