import { inject, injectable } from "tsyringe";
import type { ShopService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopProvidersContractInput,
	ShopProvidersContractOutput,
} from "./contract";

@injectable()
export class ShopProvidersUserCase
	implements UseCase<ShopProvidersContractInput, ShopProvidersContractOutput>
{
	constructor(
		@inject(TOKENS.ShopService) private readonly shopService: ShopService,
	) {}

	execute(
		_input: ShopProvidersContractInput,
	): Promise<ShopProvidersContractOutput> {
		return this.shopService.getAllProviders();
	}
}
