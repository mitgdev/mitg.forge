import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class ShopOrderItemRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	updateItem(
		id: string,
		data: {
			quantity: number;
			effectiveQuantity: number;
			unitPriceCents: number;
			totalPriceCents: number;
		},
	) {
		return this.database.miforge_shop_order_item.update({
			where: { id },
			data: {
				quantity: data.quantity,
				effectiveQuantity: data.effectiveQuantity,
				unitPriceCents: data.unitPriceCents,
				totalPriceCents: data.totalPriceCents,
			},
		});
	}

	createItem(
		orderId: string,
		productId: string,
		data: {
			quantity: number;
			effectiveQuantity: number;
			unitPriceCents: number;
			totalPriceCents: number;
		},
	) {
		return this.database.miforge_shop_order_item.create({
			data: {
				orderId,
				productId,
				quantity: data.quantity,
				effectiveQuantity: data.effectiveQuantity,
				unitPriceCents: data.unitPriceCents,
				totalPriceCents: data.totalPriceCents,
			},
		});
	}
}
