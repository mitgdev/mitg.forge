import { inject, injectable } from "tsyringe";
import type { ShopService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopServicesContractInput,
	ShopServicesContractOutput,
} from "./contract";

@injectable()
export class ShopServicesUseCase
	implements UseCase<ShopServicesContractInput, ShopServicesContractOutput>
{
	constructor(
		@inject(TOKENS.ShopService) private readonly shopService: ShopService,
	) {}

	async execute(
		_input: ShopServicesContractInput,
	): Promise<ShopServicesContractOutput> {
		return this.shopService.getAllServices();
	}
}
