import { ShopListProductsContractSchema } from "@/application/usecases/shop/listProducts/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const productsSearchRoute = publicProcedure
	.route({
		method: "GET",
		path: "/search",
		summary: "Search Products",
		description: "Searches for products in the shop.",
	})
	.input(ShopListProductsContractSchema.input)
	.output(ShopListProductsContractSchema.output)
	.handler(async ({ context, input }) => {
		return context.usecases.shop.listProducts.execute(input);
	});
