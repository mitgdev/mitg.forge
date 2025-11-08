import z from "zod";
import { GuildSchema } from "@/shared/schemas/Guild";
import { GuildRankSchema } from "@/shared/schemas/GuildRank";
import { PlayerSchema } from "@/shared/schemas/Player";
import { PlayerDepotItemSchema } from "@/shared/schemas/PlayerDepotItem";
import { PlayerOutfitSchema } from "@/shared/schemas/PlayerOutfits";
import { PlayerRewardSchema } from "@/shared/schemas/PlayerReward";
import { createPaginateSchema, InputPageSchema } from "@/utils/paginate";

/**
 * TODO: Maybe when can move all route schemas to application/dto/something
 * so they are not mixed with presentation layer.
 */
export const AccountCharactersSchema = {
	input: InputPageSchema,
	output: createPaginateSchema(
		PlayerSchema.omit({ lastip: true }).extend({
			depot_items: z.array(PlayerDepotItemSchema),
			outfits: z.array(PlayerOutfitSchema),
			rewards: z.array(PlayerRewardSchema),
			guild: GuildSchema.omit({ ownerid: true })
				.extend({
					owner: z.boolean(),
					rank: GuildRankSchema.nullable(),
				})
				.nullable(),
		}),
	),
};

export type AccountCharactersInput = z.infer<
	typeof AccountCharactersSchema.input
>;
export type AccountCharactersOutput = z.input<
	typeof AccountCharactersSchema.output
>;
