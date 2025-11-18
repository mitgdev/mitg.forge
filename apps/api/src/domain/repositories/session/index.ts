import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import type { Metadata } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class SessionRepository {
	constructor(
		@inject(TOKENS.Prisma) private readonly prisma: Prisma,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
	) {}

	async create({
		accountId,
		expiresAt,
		token,
	}: {
		token: string;
		accountId: number;
		expiresAt: Date;
	}) {
		return this.prisma.miforge_account_sessions.create({
			data: {
				token: token,
				accountId: accountId,
				expires_at: expiresAt,
				ip: this.metadata.ip(),
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
