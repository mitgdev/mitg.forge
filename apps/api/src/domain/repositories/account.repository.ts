import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/modules/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async findByToken(token: string) {
		return this.prisma.accounts.findFirst({
			where: {
				sessions: {
					some: {
						token,
					},
				},
			},
		});
	}

	async findByEmail(email: string) {
		return this.prisma.accounts.findFirst({
			where: {
				email,
			},
		});
	}

	async characters(accountId: number) {
		return this.prisma.players.findMany({
			where: {
				account_id: accountId,
			},
			include: {
				daily_reward_history: true,
			},
			orderBy: {
				name: "asc",
			},
		});
	}

	async bans(accountId: number) {
		return this.prisma.account_bans.findMany({
			where: {
				account_id: accountId,
			},
			orderBy: {
				expires_at: "desc",
			},
		});
	}

	async details(email: string) {
		return this.prisma.accounts.findFirst({
			where: {
				email,
			},
			include: {
				coins_transactions: true,
				store_history: true,
				sessions: true,
				players: true,
			},
		});
	}
}
