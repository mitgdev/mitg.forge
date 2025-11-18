import z from "zod";
import { getCoinType } from "@/shared/utils/coins";
import { unixTimestampToDate } from "@/shared/utils/date";

export const StoreHistory = z.object({
	id: z.number(),
	account_id: z.number(),
	mode: z.number(),
	description: z.string(),
	coin_type: z.number().transform(getCoinType),
	coin_amount: z.number(),
	time: z.bigint().transform(unixTimestampToDate),
	timestamp: z.number().transform(unixTimestampToDate),
	coins: z.number(),
});
