import z from "zod";

export const MiforgeConfigSchema = z.object({
	maintenance: z.object({
		enabled: z.boolean().default(false),
		message: z.string().default("We'll be back soon."),
	}),
	account: z.object({
		emailConfirmationRequired: z.boolean().default(false),
		emailChangeConfirmationRequired: z.boolean().default(true),
		passwordResetConfirmationRequired: z.boolean().default(false),
	}),
	mailer: z
		.object({
			enabled: z.boolean().default(false),
		})
		.default({
			enabled: false,
		}),
});

export type MiforgeConfig = z.infer<typeof MiforgeConfigSchema>;
