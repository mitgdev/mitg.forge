import z from "zod";
import { unixTimestampToDate } from "@/shared/utils/date";

export const GuildSchema = z.object({
	id: z.number().int(),
	level: z.number().int(),
	name: z.string(),
	ownerid: z.number().int(),
	creationdata: z.number().transform(unixTimestampToDate),
	motd: z.string(),
	residence: z.number(),
	balance: z.bigint(),
	points: z.number(),
});

export type Guild = z.infer<typeof GuildSchema>;
