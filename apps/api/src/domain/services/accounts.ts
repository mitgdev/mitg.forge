import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/di/tokens";
import { env } from "@/env";
import type { Cookies } from "@/infra/cookies";
import type { HasherCrypto } from "@/infra/crypto/hasher";
import type { JwtCrypto } from "@/infra/crypto/jwt";
import type { Logger } from "@/infra/logging/logger";
import type { Metadata } from "@/infra/metadata";
import type { AccountDetailsOutput } from "@/presentation/routes/v1/accounts/details/schema";
import type {
	AccountLoginInput,
	AccountLoginOutput,
} from "@/presentation/routes/v1/accounts/login/schema";
import type { AccountRepository, SessionRepository } from "@/repositories";
import { CatchDecorator } from "../decorators/Catch";
import type { SessionService } from "./session";

@injectable()
export class AccountsService {
	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.JwtCrypto) private readonly jwtCrypto: JwtCrypto,
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	@CatchDecorator()
	async login({
		email,
		password,
	}: AccountLoginInput): Promise<AccountLoginOutput> {
		/**
		 * TODO - Implement check for banned accounts to prevent login,
		 * returning an appropriate error message.
		 */
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			this.logger.warn(`Login failed for email: ${email} - account not found.`);
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const isPasswordValid = this.hasherCrypto.compare(
			password,
			account.password,
		);

		if (!isPasswordValid) {
			this.logger.warn(`Login failed for email: ${email} - invalid password.`);
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const token = this.jwtCrypto.generate(
			{
				email: account.email,
			},
			{
				expiresIn: "7d",
				subject: String(account.id),
			},
		);
		const expiredAt = new Date();
		expiredAt.setDate(expiredAt.getDate() + 7);

		/**
		 * TODO - If the request is made multiples times quickly,
		 * this can create a same token multiple times, breaking the unique constraint.
		 * We should implement a better strategy to avoid this.
		 */
		const tokenAlreadyExists = await this.sessionRepository.findByToken(token);

		if (!tokenAlreadyExists) {
			await this.sessionRepository.create({
				accountId: account.id,
				token,
				expiresAt: expiredAt,
			});
		}

		this.cookies.set(env.SESSION_TOKEN_NAME, token, {
			expires: expiredAt,
			namePrefix: true,
		});

		return {
			token: token,
		};
	}

	@CatchDecorator()
	async logout() {
		return this.sessionService.destroy();
	}

	@CatchDecorator()
	async details(): Promise<AccountDetailsOutput> {
		const session = this.metadata.session();
		const account = await this.accountRepository.details(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		return {
			...account,
			sessions: account.sessions,
			players: account.players,
			store_history: account.store_history,
		};
	}
}
