import z from "zod";

export const ServerStatus = z.object({
	uptime: z.number(),
	version: z.string(),
	client: z.string(),
	players: z.object({
		online: z.number(),
		max: z.number(), // 0 is not limit
		record: z.number(),
	}),
});

export type ServerStatus = z.infer<typeof ServerStatus>;
