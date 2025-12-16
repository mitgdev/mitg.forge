import { ORPCError } from "@orpc/client";
import { ShopOrderStatus, ShopProductQuantityMode } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { ExecutionContext } from "@/domain/context";
import type {
	ShopOrderItemRepository,
	ShopOrderRepository,
	ShopPaymentOptionRepository,
	ShopProductRepository,
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
		@inject(TOKENS.ShopProductRepository)
		private readonly shopProductRepository: ShopProductRepository,
		@inject(TOKENS.ShopOrderItemRepository)
		private readonly shopOrderItemRepository: ShopOrderItemRepository,
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

	private verifyUnit(
		units: number,
		product: { minUnits: number; maxUnits?: number; unitStep: number },
	) {
		if (units < product.minUnits) {
			throw new ORPCError("BAD_REQUEST", {
				message: `Minimum order quantity for this product is ${product.minUnits}.`,
			});
		}

		if (product.maxUnits != null && units > product.maxUnits) {
			throw new ORPCError("BAD_REQUEST", {
				message: `Maximum order quantity for this product is ${product.maxUnits}.`,
			});
		}

		const diff = units - product.minUnits;
		if (diff % product.unitStep !== 0) {
			throw new ORPCError("BAD_REQUEST", {
				message: `Order quantity must be in increments of ${product.unitStep}.`,
			});
		}
	}

	async addOrUpdateItem(input: {
		productId: string;
		quantity: number;
		mode?: "ADD" | "SET";
	}): Promise<ShopOrderForm> {
		const orderform = await this.orderForm();

		if (orderform.status !== ShopOrderStatus.DRAFT) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Cannot add items to a non-draft order.",
			});
		}

		const product = await this.shopProductRepository.findById(input.productId);

		if (!product || !product.enabled) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Product is not available",
			});
		}

		let units = input.quantity;

		if (units <= 0) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Quantity must be greater than zero.",
			});
		}

		if (product.quantityMode === ShopProductQuantityMode.FIXED) {
			units = 1;
		}

		if (product.quantityMode === ShopProductQuantityMode.VARIABLE) {
			this.verifyUnit(units, {
				minUnits: product.minUnits,
				maxUnits: product.maxUnits ?? undefined,
				unitStep: product.unitStep,
			});
		}

		const unitPriceCents = product.unitPriceCents;
		const effectiveQuantityPerUnit = product.baseUnitQuantity;
		const effectiveQuantity = units * effectiveQuantityPerUnit;
		const totalPriceCents = unitPriceCents * units;

		const existingItem = orderform.items.find(
			(item) => item.productId === product.id,
		);

		if (existingItem) {
			let newUnits: number;
			const mode = input.mode || "ADD";

			if (product.quantityMode === ShopProductQuantityMode.FIXED) {
				newUnits = 1;
			} else {
				newUnits = mode === "SET" ? units : existingItem.quantity + units;

				this.verifyUnit(newUnits, {
					minUnits: product.minUnits,
					maxUnits: product.maxUnits ?? undefined,
					unitStep: product.unitStep,
				});
			}

			const newEffectiveQuantity = newUnits * effectiveQuantityPerUnit;
			const newTotalPriceCents = unitPriceCents * newUnits;

			await this.shopOrderItemRepository.updateItem(existingItem.id, {
				quantity: newUnits,
				effectiveQuantity: newEffectiveQuantity,
				unitPriceCents: unitPriceCents,
				totalPriceCents: newTotalPriceCents,
			});
		}

		if (!existingItem) {
			await this.shopOrderItemRepository.createItem(orderform.id, product.id, {
				quantity: units,
				effectiveQuantity: effectiveQuantity,
				unitPriceCents: unitPriceCents,
				totalPriceCents: totalPriceCents,
			});
		}

		return this.orderForm();
	}
}
