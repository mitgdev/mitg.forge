import type {
	MiforgeAccountConfirmationChannel,
	MiforgeAccountConfirmationType,
} from "generated/client";
import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountConfirmationsRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	async findByToken(tokenHash: string) {
		return this.database.miforge_account_confirmations.findFirst({
			where: {
				token: tokenHash,
				expires_at: {
					gte: new Date(),
				},
				confirmed_at: null,
				cancelled_at: null,
			},
		});
	}

	async findByAccountAndType(
		accountId: number,
		type: MiforgeAccountConfirmationType,
		tokenHash?: string,
	) {
		return this.database.miforge_account_confirmations.findFirst({
			where: {
				accountId,
				type,
				expires_at: {
					gte: new Date(),
				},
				confirmed_at: null,
				cancelled_at: null,
				...(tokenHash ? { token: tokenHash } : {}),
			},
		});
	}

	async findByAccountAndToken(accountId: number, tokenHash: string) {
		return this.database.miforge_account_confirmations.findUnique({
			where: {
				uq_token_account: {
					accountId,
					token: tokenHash,
				},
			},
		});
	}

	async create(
		accountId: number,
		data: {
			type: MiforgeAccountConfirmationType;
			channel: MiforgeAccountConfirmationChannel;
			tokenHash: string;
			expiresAt: Date;
			value?: string;
		},
	) {
		return this.database.miforge_account_confirmations.create({
			data: {
				accountId,
				channel: data.channel,
				type: data.type,
				token: data.tokenHash,
				expires_at: data.expiresAt,
				value: data.value,
			},
		});
	}

	async isExpired(accountId: number, hashToken: string) {
		const record = await this.database.miforge_account_confirmations.findUnique(
			{
				where: {
					uq_token_account: {
						accountId,
						token: hashToken,
					},
				},
				select: {
					expires_at: true,
				},
			},
		);

		if (!record) {
			return true;
		}

		return record.expires_at < new Date();
	}

	async update(
		id: number,
		data: {
			confirmedAt?: Date;
			cancelledAt?: Date;
			lastAttemptAt?: Date;
			attempts?: number;
		},
	) {
		return this.database.miforge_account_confirmations.update({
			where: {
				id,
			},
			data: {
				last_attempt_at: data.lastAttemptAt,
				cancelled_at: data.cancelledAt,
				confirmed_at: data.confirmedAt,
				attempts: data.attempts,
			},
		});
	}
}
