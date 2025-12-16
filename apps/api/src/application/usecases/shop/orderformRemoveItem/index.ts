import { inject, injectable } from "tsyringe";
import type { ShopOrderService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopOrderFormRemoveItemContractInput,
	ShopOrderFormRemoveItemContractOutput,
} from "./contract";

@injectable()
export class ShopOrderFormRemoveItemUseCase
	implements
		UseCase<
			ShopOrderFormRemoveItemContractInput,
			ShopOrderFormRemoveItemContractOutput
		>
{
	constructor(
		@inject(TOKENS.ShopOrderService)
		private readonly shopOrderService: ShopOrderService,
	) {}

	execute(
		input: ShopOrderFormRemoveItemContractInput,
	): Promise<ShopOrderFormRemoveItemContractOutput> {
		return this.shopOrderService.removeItem(input.itemId);
	}
}
