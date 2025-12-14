import {
	ShopProvider,
	ShopProviderMethod,
	ShopTransactionStatus,
} from "generated/client";
import z from "zod";

export const ShopOrder = z.object({
	id: z.number(),
	price: z.number(),
	status: z.enum(ShopTransactionStatus),
	method: z.enum(ShopProviderMethod),
	provider: z.enum(ShopProvider),
	interaction: z.object({
		transaction: z.object({
			qr_code: z.string().nullable(),
			qr_code_base64: z.string().nullable(),
		}),
	}),
});

export type ShopOrder = z.infer<typeof ShopOrder>;
