import z from "zod";
import { unixTimestampToDate } from "@/shared/utils/date";

export const PlayerDailyRewardHistorySchema = z.object({
	id: z.number().int(),
	daystreak: z.number().int(),
	player_id: z.number().int(),
	timestamp: z.number().transform(unixTimestampToDate),
	description: z.string().nullable(),
});

export type PlayerDailyRewardHistory = z.infer<
	typeof PlayerDailyRewardHistorySchema
>;
