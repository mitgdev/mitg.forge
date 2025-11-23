import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { AccountConfirmationsRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class AccountConfirmationsService {
	constructor(
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
	) {}

	@Catch()
	async verifyConfirmation(
		confirmation: {
			id: number;
			max_attempts: number;
			attempts: number;
			expires_at: Date;
			token: string;
		} | null,
		token?: string,
	) {
		if (!confirmation || !token) {
			throw new ORPCError("NOT_FOUND", {
				message: "No confirmation request found",
			});
		}

		const maxAttempts = confirmation.max_attempts;
		const previousAttempts = confirmation.attempts;
		const actualAttempts = previousAttempts + 1;

		if (actualAttempts > maxAttempts) {
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

		if (confirmation.token !== token) {
			await this.accountConfirmationsRepository.update(confirmation.id, {
				attempts: actualAttempts,
			});

			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid confirmation token",
			});
		}
	}
}
