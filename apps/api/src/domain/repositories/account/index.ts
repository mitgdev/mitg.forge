import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import type { PaginationInput } from "@/shared/utils/paginate";

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

	async findCharacterByName(name: string, account_id: number) {
		return this.prisma.players.findFirst({
			where: {
				account_id: account_id,
				name,
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

	async storeHistory(
		accountId: number,
		opts?: {
			pagination: PaginationInput;
		},
	) {
		const page = opts?.pagination.page ?? 1;
		const size = opts?.pagination.size ?? 10;

		const [storeHistory, total] = await Promise.all([
			this.prisma.store_history.findMany({
				where: {
					account_id: accountId,
				},
				orderBy: {
					time: "desc",
				},
				skip: (page - 1) * size,
				take: size,
			}),
			this.prisma.store_history.count({
				where: {
					account_id: accountId,
				},
			}),
		]);

		return {
			storeHistory,
			total,
		};
	}

	async details(email: string) {
		return this.prisma.accounts.findFirst({
			where: {
				email,
			},
			include: {
				sessions: true,
				registrations: {
					omit: {
						recoveryKey: true,
					},
				},
			},
		});
	}
}
