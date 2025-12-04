import type { accounts } from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import { getAccountTypeId } from "@/shared/utils/account/type";
import type { PaginationInput } from "@/shared/utils/paginate";

@injectable()
export class AccountRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async updateTwoFactor(
		accountId: number,
		data: Partial<
			Pick<
				accounts,
				| "two_factor_enabled"
				| "two_factor_secret"
				| "two_factor_temp_secret"
				| "two_factor_confirmed_at"
			>
		>,
	) {
		return this.prisma.accounts.update({
			where: {
				id: accountId,
			},
			data: data,
		});
	}

	async findAccountByIdWithRegistrations(accountId: number) {
		return this.prisma.accounts.findUnique({
			where: {
				id: accountId,
			},
			include: {
				registrations: true,
			},
		});
	}

	async findAccountByRecoveryKey(recoveryKey: string) {
		return this.prisma.accounts.findFirst({
			where: {
				registrations: {
					recoveryKey: recoveryKey,
				},
			},
		});
	}

	updateEmail(accountId: number, email: string) {
		return this.prisma.accounts.update({
			where: {
				id: accountId,
			},
			data: {
				email,
			},
		});
	}

	updatePassword(accountId: number, hashedPassword: string) {
		return this.prisma.accounts.update({
			where: {
				id: accountId,
			},
			data: {
				password: hashedPassword,
			},
		});
	}

	resetConfirmEmail(email: string) {
		return this.prisma.accounts.update({
			where: {
				email,
			},
			data: {
				email_confirmed: false,
			},
		});
	}

	confirmEmail(email: string) {
		return this.prisma.accounts.update({
			where: {
				email,
			},
			data: {
				email_confirmed: true,
			},
		});
	}

	create(data: { name?: string; password: string; email: string }) {
		return this.prisma.accounts.create({
			data: {
				...data,
				type: getAccountTypeId("PLAYER"),
			},
		});
	}

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

	async findByCharacterName(name: string) {
		return this.prisma.accounts.findFirst({
			where: {
				players: {
					some: {
						name,
					},
				},
			},
		});
	}

	async findById(id: number) {
		return this.prisma.accounts.findUnique({
			where: {
				id,
			},
		});
	}

	async findByEmail(email: string) {
		return this.prisma.accounts.findUnique({
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
