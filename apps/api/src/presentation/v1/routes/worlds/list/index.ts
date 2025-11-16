import { WorldsListContractSchema } from "@/application/usecases/worlds/list/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const worldsListRoute = publicProcedure
	.route({
		method: "GET",
		path: "/",
		summary: "All Worlds",
		description: "Retrieve a list of worlds.",
	})
	.output(WorldsListContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.world.list.execute();
	});
