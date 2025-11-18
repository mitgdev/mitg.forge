import z from "zod";
import { GuildSchema } from "@/shared/schemas/Guild";
import { GuildRankSchema } from "@/shared/schemas/GuildRank";
import { PlayerSchema } from "@/shared/schemas/Player";
import { PlayerDailyRewardHistorySchema } from "@/shared/schemas/PlayerDailyRewardHistory";
import { PlayerDepotItemSchema } from "@/shared/schemas/PlayerDepotItem";
import { PlayerOutfitSchema } from "@/shared/schemas/PlayerOutfits";
import { PlayerRewardSchema } from "@/shared/schemas/PlayerReward";
import { createPaginateSchema, InputPageSchema } from "@/shared/utils/paginate";

export const AccountCharactersContractSchema = {
	input: InputPageSchema,
	output: createPaginateSchema(
		PlayerSchema.omit({ lastip: true }).extend({
			online: z.boolean(),
			depot_items: z.array(PlayerDepotItemSchema),
			outfits: z.array(PlayerOutfitSchema),
			rewards: z.array(PlayerRewardSchema),
			daily_reward_collected: z.boolean(),
			daily_reward_history: z.array(PlayerDailyRewardHistorySchema),
			guild: GuildSchema.omit({ ownerid: true })
				.extend({
					owner: z.boolean(),
					rank: GuildRankSchema.nullable(),
				})
				.nullable(),
		}),
	),
};

export type AccountCharactersContractInput = z.infer<
	typeof AccountCharactersContractSchema.input
>;
export type AccountCharactersContractOutput = z.input<
	typeof AccountCharactersContractSchema.output
>;
