import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { ExecutionContext } from "@/domain/context";
import type {
	Cookies,
	HasherCrypto,
	JwtCrypto,
	Logger,
	TwoFactorAuth,
} from "@/domain/modules";
import type {
	AccountRepository,
	ConfigRepository,
	SessionRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { getAccountType } from "@/shared/utils/account/type";

@injectable()
export class SessionService {
	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.HttpContext) private readonly httpContext: HttpContext,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
		@inject(TOKENS.JwtCrypto) private readonly jwt: JwtCrypto,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
		@inject(TOKENS.ConfigRepository)
		private readonly configRepository: ConfigRepository,
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.TwoFactorAuth) private readonly twoFactorAuth: TwoFactorAuth,
	) {}

	@Catch()
	async login({
		email,
		password,
		twoFactorToken,
	}: {
		email: string;
		password: string;
		twoFactorToken?: string;
	}) {
		/**
		 * TODO - Implement check for banned accounts to prevent login,
		 * returning an appropriate error message.
		 */
		const account = await this.accountRepository.findByEmail(email);
		const config = await this.configRepository.findConfig();

		if (!account) {
			this.logger.warn(`Login failed for email: ${email} - account not found.`);
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
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

		/**
		 * This config is a live config from database, so changes
		 * will be reflected without server restarts.
		 */
		if (!account.email_confirmed && config.account.emailConfirmationRequired) {
			this.logger.warn(
				`Login attempt for email: ${email} - email not confirmed.`,
			);
			throw new ORPCError("FORBIDDEN", {
				message: "Email address not confirmed",
			});
		}

		if (account.two_factor_enabled) {
			if (!account.two_factor_secret) {
				throw new ORPCError("INTERNAL_SERVER_ERROR", {
					message: "Two-factor authentication is misconfigured",
				});
			}

			if (!twoFactorToken) {
				throw new ORPCError("FORBIDDEN", {
					cause: "TWO_FACTOR_TOKEN_MISSING",
					data: {
						cause: "TWO_FACTOR_TOKEN_MISSING",
					},
					message: "Two-factor authentication token required",
				});
			}

			const isTwoFactorTokenValid = this.twoFactorAuth.verify({
				secret: account.two_factor_secret,
				token: twoFactorToken,
			});

			if (!isTwoFactorTokenValid) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Invalid credentials",
				});
			}
		}

		const token = this.jwt.generate(
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
				ip: this.executionContext.ip(),
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

	@Catch()
	async logout() {
		return this.destroy();
	}

	@Catch()
	async setSession() {
		const token =
			this.executionContext.bearer() ??
			this.executionContext.bearerFromCookies();

		if (!token) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No authentication token provided",
			});
		}

		const isValid = this.jwt.verify(token);

		if (!isValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid or expired authentication token",
			});
		}

		const account = await this.accountRepository.findByToken(token);

		if (!account) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No account associated with this token",
			});
		}

		this.httpContext.set("session", {
			token,
			id: account.id,
			email: account.email,
			type: getAccountType(account.type),
		});

		return account;
	}

	@Catch()
	async setSessionIfExists() {
		const token =
			this.executionContext.bearer() ??
			this.executionContext.bearerFromCookies();

		if (!token) {
			return;
		}

		const isValid = this.jwt.verify(token);

		if (!isValid) {
			return;
		}

		const account = await this.accountRepository.findByToken(token);

		if (!account) {
			return;
		}

		this.httpContext.set("session", {
			token,
			id: account.id,
			email: account.email,
			type: getAccountType(account.type),
		});
	}

	@Catch()
	async isNotAuthenticated() {
		const token =
			this.executionContext.bearer() ??
			this.executionContext.bearerFromCookies();

		if (!token) {
			return;
		}

		const isValid = this.jwt.verify(token);

		if (!isValid) {
			return;
		}

		const account = await this.accountRepository.findByToken(token);

		if (!account) {
			return;
		}

		throw new ORPCError("FORBIDDEN", {
			message: "Already authenticated",
		});
	}

	@Catch()
	async destroy() {
		const session = this.httpContext.get("session");

		if (!session) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No active session found",
			});
		}

		this.cookies.delete(env.SESSION_TOKEN_NAME, {
			namePrefix: true,
		});

		await this.sessionRepository.deleteByToken(session.token);
	}

	@Catch()
	async info() {
		try {
			const account = await this.setSession();
			const session = this.httpContext.get("session");

			if (!session) {
				return {
					authenticated: false,
					session: null,
				};
			}

			return {
				authenticated: true,
				session: {
					email: account.email,
					type: account.type,
					token: session.token,
				},
			};
		} catch {
			return {
				authenticated: false,
				session: null,
			};
		}
	}
}
