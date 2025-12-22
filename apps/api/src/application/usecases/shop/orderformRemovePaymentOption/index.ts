import { inject, injectable } from "tsyringe";
import type { ShopOrderService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopOrderFormRemovePaymentOptionContractInput,
	ShopOrderFormRemovePaymentOptionContractOutput,
} from "./contract";

@injectable()
export class ShopOrderFormRemovePaymentOptionUseCase
	implements
		UseCase<
			ShopOrderFormRemovePaymentOptionContractInput,
			ShopOrderFormRemovePaymentOptionContractOutput
		>
{
	constructor(
		@inject(TOKENS.ShopOrderService)
		private readonly shopOrderService: ShopOrderService,
	) {}

	execute(
		_input: ShopOrderFormRemovePaymentOptionContractInput,
	): Promise<ShopOrderFormRemovePaymentOptionContractOutput> {
		return this.shopOrderService.removePaymentOption();
	}
}
