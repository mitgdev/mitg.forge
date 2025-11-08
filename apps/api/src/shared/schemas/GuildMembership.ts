import z from "zod";

export const GuildMembershipSchema = z.object({
	player_id: z.number().int(),
	guild_id: z.number().int(),
	rank_id: z.number().int(),
	nick: z.string().nullable(),
});

export type GuildMembership = z.infer<typeof GuildMembershipSchema>;
