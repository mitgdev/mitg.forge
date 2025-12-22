import type { Prisma } from "generated/client";
import {
	type ShopProductFacet,
	ShopProductFacetSchema,
} from "@/shared/schemas/ShopProduct";
import { isNonEmpty, normStringArray } from "@/shared/utils/array";
import {
	type FacetHandlersFromUnion,
	makeWhereFromFacets,
} from "@/shared/utils/prisma/facets";

const shopProductHandlers = {
	title(values: string | string[]) {
		const vals = normStringArray(values);
		if (!isNonEmpty(vals)) return undefined;

		return {
			OR: vals.map((title) => ({
				title: {
					contains: title,
				},
			})),
		};
	},
	enabled(value: boolean) {
		return {
			enabled: value,
		};
	},
} satisfies FacetHandlersFromUnion<
	ShopProductFacet,
	Prisma.miforge_shop_productWhereInput
>;

export const whereFromShopProductFacets = makeWhereFromFacets<
	ShopProductFacet,
	Prisma.miforge_shop_productWhereInput
>(ShopProductFacetSchema, shopProductHandlers, {
	arrayMergePolicy: "union",
});
