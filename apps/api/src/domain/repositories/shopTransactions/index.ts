import type { ShopTransactionStatus } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class ShopTransactionsRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	async createTransaction(data: {
		serviceId: number;
		accountId: number;
		providerId: number;
		status?: ShopTransactionStatus;
		units?: number;
		total?: number;
	}) {
		return this.database.miforge_shop_transactions.create({
			data: {
				status: data.status ?? "PENDING",
				providerId: data.providerId,
				accountId: data.accountId,
				serviceId: data.serviceId,
				total: data.total ?? 0,
				units: data.units ?? 1,
			},
		});
	}

	async attachMethodTransactionId(
		transactionId: number,
		methodTransactionId: string,
	) {
		return this.database.miforge_shop_transactions.update({
			where: { id: transactionId },
			data: {
				methodTransactionId: methodTransactionId,
			},
		});
	}
}
