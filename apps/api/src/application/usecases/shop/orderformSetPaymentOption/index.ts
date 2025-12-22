import { inject, injectable } from "tsyringe";
import type { ShopOrderService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ShopOrderFormSetPaymentOptionContractInput,
	ShopOrderFormSetPaymentOptionContractOutput,
} from "./contract";

@injectable()
export class ShopOrderFormSetPaymentOptionUseCase
	implements
		UseCase<
			ShopOrderFormSetPaymentOptionContractInput,
			ShopOrderFormSetPaymentOptionContractOutput
		>
{
	constructor(
		@inject(TOKENS.ShopOrderService)
		private readonly shopOrderService: ShopOrderService,
	) {}

	execute(
		input: ShopOrderFormSetPaymentOptionContractInput,
	): Promise<ShopOrderFormSetPaymentOptionContractOutput> {
		return this.shopOrderService.selectPaymentOption(input.paymentOptionId);
	}
}
