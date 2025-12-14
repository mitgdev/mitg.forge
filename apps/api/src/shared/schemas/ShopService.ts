import { ShopServiceType } from "generated/client";
import z from "zod";

export const ShopService = z.object({
	id: z.number().int().nonnegative(),
	type: z.enum(ShopServiceType),
	slug: z.string().max(100),
	title: z.string().max(255),
	description: z.string().nullable(),
	unit_price: z.number().nonnegative(),
	quantity: z.number().int().nonnegative(),
	is_active: z.boolean().default(true),
	created_at: z.date(),
	updated_at: z.date(),
});

export type ShopService = z.infer<typeof ShopService>;
