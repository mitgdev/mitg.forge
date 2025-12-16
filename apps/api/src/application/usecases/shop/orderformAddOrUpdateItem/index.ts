import { inject, injectable } from "tsyringe";
import type { ShopOrderService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopOrderFormAddOrUpdateItemContractInput,
	ShopOrderFormAddOrUpdateItemContractOutput,
} from "./contract";

@injectable()
export class ShopOrderFormAddOrUpdateItemUseCase
	implements
		UseCase<
			ShopOrderFormAddOrUpdateItemContractInput,
			ShopOrderFormAddOrUpdateItemContractOutput
		>
{
	constructor(
		@inject(TOKENS.ShopOrderService)
		private readonly shopOrderService: ShopOrderService,
	) {}

	execute(
		input: ShopOrderFormAddOrUpdateItemContractInput,
	): Promise<ShopOrderFormAddOrUpdateItemContractOutput> {
		return this.shopOrderService.addOrUpdateItem({
			productId: input.productId,
			quantity: input.quantity,
			mode: input.mode,
		});
	}
}
