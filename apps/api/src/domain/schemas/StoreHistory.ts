import z from "zod";
import { unixTimestampToDate } from "@/utils/date";

export const StoreHistory = z.object({
	id: z.number(),
	account_id: z.number(),
	mode: z.number(),
	description: z.string(),
	coin_type: z.number(),
	coin_amount: z.number(),
	time: z.bigint().transform(unixTimestampToDate),
	timestamp: z.number(),
	coins: z.number(),
});
