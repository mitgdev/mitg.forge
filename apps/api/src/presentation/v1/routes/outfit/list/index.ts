import { PlayerOutfitsContractSchema } from "@/application/usecases/players/outfits/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const outfitsPreviewRoute = publicProcedure
	.route({
		method: "POST",
		path: "/list/preview",
		summary: "Outfit's Preview",
		description:
			"Generate a preview of list of outfits based on the provided parameters",
	})
	.input(PlayerOutfitsContractSchema.input)
	.output(PlayerOutfitsContractSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.players.outfits.execute(input);
	});
