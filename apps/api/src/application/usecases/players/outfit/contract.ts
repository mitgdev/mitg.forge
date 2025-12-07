import type z from "zod";
import {
	OutfitAnimationInputSchema,
	OutfitAnimationSchema,
} from "@/shared/schemas/OutfitAnimation";

export const PlayerOutfitContractSchema = {
	input: OutfitAnimationInputSchema,
	output: OutfitAnimationSchema,
};

export type PlayerOutfitContractInput = z.infer<
	typeof PlayerOutfitContractSchema.input
>;
export type PlayerOutfitContractOutput = z.infer<
	typeof PlayerOutfitContractSchema.output
>;
