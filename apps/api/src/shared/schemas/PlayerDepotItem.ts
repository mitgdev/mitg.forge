import z from "zod";

export const PlayerDepotItemSchema = z.object({
	player_id: z.number().int(),
	sid: z.number().int(),
	pid: z.number().int(),
	itemtype: z.number().int(),
	count: z.number().int(),
});

export type PlayerDepotItem = z.infer<typeof PlayerDepotItemSchema>;
