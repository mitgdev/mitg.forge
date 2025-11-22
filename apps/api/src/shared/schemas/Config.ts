import z from "zod";

export const MiforgeConfigSchema = z.object({
	maintenance: z.object({
		enabled: z.boolean().default(false),
		message: z.string().default("We'll be back soon."),
	}),
	notifications: z.object({
		emailEnabled: z.boolean().default(false),
	}),
});

export type MiforgeConfig = z.infer<typeof MiforgeConfigSchema>;
