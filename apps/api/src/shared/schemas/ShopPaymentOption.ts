import { ShopPaymentMethod, ShopPaymentProvider } from "generated/client";
import z from "zod";

export const ShopPaymentOptionProviderEnum = z.enum(ShopPaymentProvider);
export const ShopPaymentOptionMethodEnum = z.enum(ShopPaymentMethod);

export const ShopPaymentOption = z.object({
	id: z.uuid(),

	provider: ShopPaymentOptionProviderEnum,
	method: ShopPaymentOptionMethodEnum,

	enabled: z.boolean(),
	label: z.string(),
	description: z.string().nullable(),

	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});
