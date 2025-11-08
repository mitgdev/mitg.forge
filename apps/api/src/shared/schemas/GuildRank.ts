import z from "zod";

export const GuildRankSchema = z.object({
	id: z.number().int(),
	guild_id: z.number().int(),
	name: z.string(),
	level: z.number().int(),
});

export type GuildRank = z.infer<typeof GuildRankSchema>;
