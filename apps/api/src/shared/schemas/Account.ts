import z from "zod";
import { unixTimestampToDate } from "@/shared/utils/date";

export const AccountSchema = z.object({
	id: z.number(),
	name: z.string(),
	password: z.string(),
	email: z.email(),
	premdays: z.number(),
	premdays_purchased: z.number(),
	lastday: z.number().transform(unixTimestampToDate),
	type: z.number(),
	coins: z.number(),
	coins_transferable: z.number(),
	tournament_coins: z.number(),
	creation: z.number().transform(unixTimestampToDate),
	recruiter: z.number().nullable(),
	house_bid_id: z.number(),
});
