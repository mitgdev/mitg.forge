import { PlayerOutfitContractSchema } from "@/application/usecases/players/outfit/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const outfitPreviewRoute = publicProcedure
	.route({
		method: "GET",
		path: "/preview",
		summary: "Outfit Preview",
		description:
			"Generate a preview of an outfit based on the provided parameters",
	})
	.input(PlayerOutfitContractSchema.input)
	.output(PlayerOutfitContractSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.players.outfit.execute(input);
	});
