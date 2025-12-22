import z from "zod";
import {
	ShopProduct,
	ShopProductFacetSchema,
} from "@/shared/schemas/ShopProduct";
import { createPaginateSchema, InputPageSchema } from "@/shared/utils/paginate";

export const ShopListProductsContractSchema = {
	input: InputPageSchema.extend({
		facets: z
			.array(ShopProductFacetSchema)
			.optional()
			.meta({
				description: "Facets to filter products by",
				examples: [
					"facets[0][key]=title&facets[0][value][]=coins",
					"https://orpc.dev/docs/openapi/bracket-notation",
				],
			}),
	}),
	output: createPaginateSchema(ShopProduct),
};

export type ShopListProductsContractInput = z.infer<
	typeof ShopListProductsContractSchema.input
>;
export type ShopListProductsContractOutput = z.infer<
	typeof ShopListProductsContractSchema.output
>;
