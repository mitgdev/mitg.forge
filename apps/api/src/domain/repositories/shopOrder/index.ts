import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class ShopOrderRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	findRecentOrderByAccountId(accountId: number) {
		return this.database.miforge_shop_order.findFirst({
			where: {
				accountId,
				status: {
					in: ["DRAFT", "PENDING_PAYMENT"],
				},
			},
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
				paymentOption: true,
			},
		});
	}

	createOrder(accountId: number) {
		return this.database.miforge_shop_order.create({
			data: {
				accountId,
				status: "DRAFT",
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
				paymentOption: true,
			},
		});
	}
}
