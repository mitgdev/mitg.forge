import z from "zod";
import {
	OutfitAnimationInputSchema,
	OutfitAnimationSchema,
} from "@/shared/schemas/OutfitAnimation";

export const PlayerOutfitsContractSchema = {
	input: z.object({
		parameters: z.array(OutfitAnimationInputSchema),
	}),
	output: z.object({
		outfits: z.array(
			z.object({
				input: OutfitAnimationInputSchema,
				frames: OutfitAnimationSchema,
			}),
		),
	}),
};

export type PlayerOutfitsContractInput = z.infer<
	typeof PlayerOutfitsContractSchema.input
>;
export type PlayerOutfitsContractOutput = z.infer<
	typeof PlayerOutfitsContractSchema.output
>;
