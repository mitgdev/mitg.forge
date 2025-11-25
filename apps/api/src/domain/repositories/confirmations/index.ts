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

	async findByAccountAndType(
		accountId: number,
		type: MiforgeAccountConfirmationType,
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
			},
		});
	}

	async findByAccountAndToken(accountId: number, token: string) {
		return this.database.miforge_account_confirmations.findUnique({
			where: {
				uq_token_account: {
					accountId,
					token,
				},
			},
		});
	}

	async create(
		accountId: number,
		data: {
			type: MiforgeAccountConfirmationType;
			channel: MiforgeAccountConfirmationChannel;
			token: string;
			expiresAt: Date;
		},
	) {
		return this.database.miforge_account_confirmations.create({
			data: {
				accountId,
				channel: data.channel,
				type: data.type,
				token: data.token,
				expires_at: data.expiresAt,
			},
		});
	}

	async isExpired(accountId: number, code: string) {
		const record = await this.database.miforge_account_confirmations.findUnique(
			{
				where: {
					uq_token_account: {
						accountId,
						token: code,
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
