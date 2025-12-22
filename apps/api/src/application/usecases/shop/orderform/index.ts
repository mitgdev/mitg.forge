import { inject, injectable } from "tsyringe";
import type { ShopOrderService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopOrderFormContractInput,
	ShopOrderFormContractOutput,
} from "./contract";

@injectable()
export class ShopOrderFormUseCase
	implements UseCase<ShopOrderFormContractInput, ShopOrderFormContractOutput>
{
	constructor(
		@inject(TOKENS.ShopOrderService)
		private readonly shopOrderService: ShopOrderService,
	) {}
	execute(
		_input: ShopOrderFormContractInput,
	): Promise<ShopOrderFormContractOutput> {
		return this.shopOrderService.orderForm();
	}
}
