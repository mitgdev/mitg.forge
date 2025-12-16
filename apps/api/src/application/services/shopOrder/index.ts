import { inject, injectable } from "tsyringe";
import type { ExecutionContext } from "@/domain/context";
import type {
	ShopOrderRepository,
	ShopPaymentOptionRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type {
	ShopOrderForm,
	ShopOrderFormTotalizer,
} from "@/shared/schemas/ShopOrderForm";

@injectable()
export class ShopOrderService {
	constructor(
		@inject(TOKENS.ShopOrderRepository)
		private readonly shopOrderRepository: ShopOrderRepository,
		@inject(TOKENS.ShopPaymentOptionRepository)
		private readonly shopPaymentOptionRepository: ShopPaymentOptionRepository,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
	) {}

	async orderForm(): Promise<ShopOrderForm> {
		const session = this.executionContext.session();

		let order = await this.shopOrderRepository.findRecentOrderByAccountId(
			session.id,
		);

		if (!order) {
			order = await this.shopOrderRepository.createOrder(session.id);
		}

		const providers = await this.shopPaymentOptionRepository.findAll();

		const selectedProvider =
			providers.find((provider) => provider.id === order.paymentOptionId) ||
			null;

		const itemsTotalCents = order.items.reduce((sum, item) => {
			return sum + item.totalPriceCents;
		}, 0);

		const discountTotalCents = 0; // Placeholder for discount calculation

		const totalTotalCents = itemsTotalCents - discountTotalCents;

		const totalizers: Array<ShopOrderFormTotalizer> = [
			{
				id: "ITEMS",
				label: "Items Total",
				valueCents: itemsTotalCents,
			},
			{
				id: "TOTAL",
				label: "Total",
				valueCents: totalTotalCents,
			},
		];

		return {
			id: order.id,
			status: order.status,
			account: {
				email: session.email,
			},
			items: order.items.map((item) => {
				return {
					...item,
					productId: item.product.id,
					productSlug: item.product.slug,
					category: item.product.category,
					description: item.product.description,
					title: item.product.title,
				};
			}),
			payment: {
				providers: providers,
				selectedProvider: selectedProvider,
			},
			totals: {
				totalizers: totalizers,
			},
			updatedAt: order.updatedAt,
			createdAt: order.createdAt,
		};
	}
}
