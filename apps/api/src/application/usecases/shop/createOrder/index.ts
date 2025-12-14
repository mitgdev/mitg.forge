import { inject, injectable } from "tsyringe";
import type { ShopService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopCreateOrderContractInput,
	ShopCreateOrderContractOutput,
} from "./contract";

@injectable()
export class ShopCreateOrderUseCase
	implements
		UseCase<ShopCreateOrderContractInput, ShopCreateOrderContractOutput>
{
	constructor(
		@inject(TOKENS.ShopService)
		private readonly shopService: ShopService,
	) {}

	execute(
		input: ShopCreateOrderContractInput,
	): Promise<ShopCreateOrderContractOutput> {
		return this.shopService.createOrder({
			providerId: input.providerId,
			serviceId: input.serviceId,
		});
	}
}
