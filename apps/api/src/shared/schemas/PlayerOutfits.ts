import z from "zod";

export const PlayerOutfitSchema = z.object({
	player_id: z.number().int(),
	outfit_id: z.number().int(),
	addons: z.number().int(),
});

export type PlayerOutfit = z.infer<typeof PlayerOutfitSchema>;
