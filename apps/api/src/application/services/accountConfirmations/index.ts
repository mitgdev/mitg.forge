import { ORPCError } from "@orpc/client";
import type { MiforgeAccountConfirmationType } from "generated/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { RandomCode, TokenHasher } from "@/domain/modules";
import type { AccountConfirmationsRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountConfirmationsService {
	constructor(
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
		@inject(TOKENS.TokenHasher) private readonly tokenHasher: TokenHasher,
		@inject(TOKENS.RandomCode) private readonly randomCode: RandomCode,
	) {}

	@Catch()
	async isValid(token: string) {
		const hash = this.tokenHasher.hash(token);

		const confirmation =
			await this.accountConfirmationsRepository.findByToken(hash);

		if (!confirmation) {
			throw new ORPCError("NOT_FOUND", {
				message: "No confirmation request found or has expired",
			});
		}

		return confirmation;
	}

	@Catch()
	async isValidByAccountAndType(data: {
		accountId: number;
		type: MiforgeAccountConfirmationType;
		rawToken?: string;
	}) {
		const hash = data.rawToken
			? this.tokenHasher.hash(data.rawToken)
			: undefined;

		const confirmation =
			await this.accountConfirmationsRepository.findByAccountAndType(
				data.accountId,
				data.type,
				hash,
			);

		if (!confirmation) {
			throw new ORPCError("NOT_FOUND", {
				message: "No confirmation request found or has expired",
			});
		}

		return confirmation;
	}

	@Catch()
	async verifyConfirmation(
		confirmation: {
			id: number;
			max_attempts: number;
			attempts: number;
			expires_at: Date;
			cancelled_at: Date | null;
			confirmed_at: Date | null;
			token: string;
		} | null,
		token?: string,
	) {
		if (!confirmation || !token) {
			throw new ORPCError("NOT_FOUND", {
				message: "No confirmation request found has expired",
			});
		}

		const rawToken = token;
		const hashToken = confirmation.token;

		const isValid = this.tokenHasher.verify(rawToken, hashToken);

		if (!isValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid confirmation token",
			});
		}

		const isConfirmed = confirmation.confirmed_at !== null;

		if (isConfirmed) {
			throw new ORPCError("FORBIDDEN", {
				message: "Confirmation request has already been confirmed",
			});
		}

		const isCancelled = confirmation.cancelled_at !== null;

		if (isCancelled) {
			throw new ORPCError("FORBIDDEN", {
				message: "Confirmation request has been cancelled",
			});
		}

		const maxAttempts = confirmation.max_attempts;
		const previousAttempts = confirmation.attempts;
		const actualAttempts = previousAttempts + 1;

		if (actualAttempts > maxAttempts) {
			await this.accountConfirmationsRepository.update(confirmation.id, {
				cancelledAt: new Date(),
				attempts: actualAttempts,
				lastAttemptAt: new Date(),
			});

			throw new ORPCError("FORBIDDEN", {
				message: "Maximum confirmation attempts exceeded",
			});
		}

		const isExpired = confirmation.expires_at < new Date();

		if (isExpired) {
			throw new ORPCError("FORBIDDEN", {
				message: "Confirmation code has expired",
			});
		}

		const hashedRawToken = this.tokenHasher.hash(rawToken);
		if (confirmation.token !== hashedRawToken) {
			await this.accountConfirmationsRepository.update(confirmation.id, {
				attempts: actualAttempts,
				lastAttemptAt: new Date(),
			});

			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid confirmation token",
			});
		}

		await this.accountConfirmationsRepository.update(confirmation.id, {
			confirmedAt: new Date(),
			attempts: actualAttempts,
			lastAttemptAt: new Date(),
		});
	}

	@Catch()
	async generateTokenAndHash(expiresInMinutes: number) {
		const token = this.randomCode.generateToken(32, "base64url");
		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
		const tokenHash = this.tokenHasher.hash(token);

		return { token, tokenHash, expiresAt };
	}
}
