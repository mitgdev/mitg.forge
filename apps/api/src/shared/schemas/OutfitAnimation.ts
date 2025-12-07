import z from "zod";

export const OutfitAnimationFrameSchema = z.object({
	image: z.string(),
	duration: z.number(),
});

export const OutfitAnimationInputSchema = z.object({
	looktype: z.coerce.number().min(1).max(65535),
	addons: z.coerce.number().min(1).max(3).default(1),
	head: z.coerce.number().min(0).max(255).default(0),
	body: z.coerce.number().min(0).max(255).default(0),
	legs: z.coerce.number().min(0).max(255).default(0),
	feet: z.coerce.number().min(0).max(255).default(0),
	mount: z.coerce.number().min(0).max(65535).optional(),
	direction: z.literal([1, 2, 3, 4]).default(3),
});

export const OutfitAnimationSchema = z.array(OutfitAnimationFrameSchema);

export type OutfitAnimationFrame = z.infer<typeof OutfitAnimationFrameSchema>;
export type OutfitAnimation = z.infer<typeof OutfitAnimationSchema>;
