import {
	ShopProvider as ShopProviderEnum,
	ShopProviderMethod as ShopProviderMethodEnum,
} from "generated/client";
import z from "zod";

const ProviderMethod = z.enum(ShopProviderMethodEnum);
const Provider = z.enum(ShopProviderEnum);

export const ShopProvider = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	description: z.string().nullable(),
	isActive: z.boolean(),
	method: ProviderMethod,
	provider: Provider,
	created_at: z.date(),
	updated_at: z.date(),
});

export type ShopProvider = z.infer<typeof ShopProvider>;
export type ShopProviderMethod = z.infer<typeof ProviderMethod>;
export type Provider = z.infer<typeof Provider>;
