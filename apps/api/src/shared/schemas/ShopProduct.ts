import { ShopProductCategory, ShopProductQuantityMode } from "generated/client";
import z from "zod";

export const ShopProductCategoryEnum = z.enum(ShopProductCategory);
export const ShopProductQuantityModeEnum = z.enum(ShopProductQuantityMode);

export const ShopProduct = z.object({
	id: z.uuid(),
	category: ShopProductCategoryEnum,
	slug: z.string().max(100),
	title: z.string().max(255),
	description: z.string().nullable(),
	enabled: z.boolean(),

	baseUnitQuantity: z.number(),
	quantityMode: ShopProductQuantityModeEnum,
	minUnits: z.number(),
	maxUnits: z.number().nullable(),
	unitStep: z.number(),

	unitPriceCents: z.number(),
	displayUnitLabel: z.string().nullable(),

	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ShopProductFacetSchema = z.discriminatedUnion("key", [
	z.object({
		key: z.literal("title"),
		value: z.array(z.string().trim().min(1)).min(1),
	}),
	z.object({
		key: z.literal("enabled"),
		value: z.coerce.string().transform((val) => val === "true"),
	}),
]);

export type ShopProductFacet = z.infer<typeof ShopProductFacetSchema>;
