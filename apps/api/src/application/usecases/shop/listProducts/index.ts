import { inject, injectable } from "tsyringe";
import type { ShopProductsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopListProductsContractInput,
	ShopListProductsContractOutput,
} from "./contract";

@injectable()
export class ShopListProductsUseCase
	implements
		UseCase<ShopListProductsContractInput, ShopListProductsContractOutput>
{
	constructor(
		@inject(TOKENS.ShopProductsService)
		private shopProductsService: ShopProductsService,
	) {}

	execute(
		input: ShopListProductsContractInput,
	): Promise<ShopListProductsContractOutput> {
		return this.shopProductsService.list({
			pagination: {
				page: input.page,
				size: input.size,
			},
			filter: {
				facets: input.facets,
			},
		});
	}
}
