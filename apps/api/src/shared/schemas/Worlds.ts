import z from "zod";
import { unixTimestampToDate } from "@/shared/utils/date";

export const Worlds = z.object({
	id: z.number(),
	name: z.string(),
	type: z.enum([
		"NO_PVP",
		"PVP",
		"RETRO_PVP",
		"PVP_ENFORCED",
		"RETRO_HARDCORE",
	]),
	motd: z.string(),
	location: z.enum(["EUROPE", "NORTH_AMERICA", "SOUTH_AMERICA", "OCEANIA"]),
	ip: z.string(),
	port: z.number(),
	port_status: z.number(),
	creation: z.number().transform(unixTimestampToDate),
	created_at: z.date(),
	updated_at: z.date(),
});
