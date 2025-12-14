import { ShopServicesContractSchema } from "@/application/usecases/shop/services/contract";
import { publicProcedure } from "@/presentation/procedures/public";

export const servicesRoute = publicProcedure
	.route({
		method: "GET",
		path: "/services",
		summary: "Services",
		description: "Get a list of available services",
	})
	.input(ShopServicesContractSchema.input)
	.output(ShopServicesContractSchema.output)
	.handler(async ({ input, context }) => {
		return context.usecases.shop.services.execute(input);
	});
