import { ShopProvidersContractSchema } from "@/application/usecases/shop/providers/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const providersRoute = publicProcedure
	.route({
		method: "GET",
		path: "/providers",
		summary: "Providers",
		description: "Get a list of available providers",
	})
	.input(ShopProvidersContractSchema.input)
	.output(ShopProvidersContractSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.shop.providers.execute(input);
	});
