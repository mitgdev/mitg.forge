import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class SessionRepository {
	constructor(@inject(TOKENS.Prisma) private readonly prisma: Prisma) {}

	async create({
		accountId,
		expiresAt,
		token,
		ip,
	}: {
		token: string;
		accountId: number;
		ip: string | null;
		expiresAt: Date;
	}) {
		return this.prisma.miforge_account_sessions.create({
			data: {
				token: token,
				accountId: accountId,
				expires_at: expiresAt,
				ip: ip,
			},
		});
	}

	async findByToken(token: string) {
		return this.prisma.miforge_account_sessions.findUnique({
			where: {
				token,
			},
		});
	}

	async findByAccountId(accountId: number) {
		return this.prisma.miforge_account_sessions.findMany({
			where: {
				accountId,
			},
		});
	}

	async deleteByToken(token: string) {
		return this.prisma.miforge_account_sessions.delete({
			where: {
				token,
			},
		});
	}

	async clearAllSessionByAccountId(accountId: number) {
		return this.prisma.miforge_account_sessions.deleteMany({
			where: {
				accountId,
			},
		});
	}
}
