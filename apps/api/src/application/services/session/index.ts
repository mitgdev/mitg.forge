import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { Cookies, JwtCrypto, Metadata } from "@/domain/modules";
import type {
	AccountRepository,
	SessionRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { getAccountType } from "@/shared/utils/account/type";

@injectable()
export class SessionService {
	constructor(
		@inject(TOKENS.Context) private readonly context: ReqContext,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
		@inject(TOKENS.JwtCrypto) private readonly jwt: JwtCrypto,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
	) {}

	@Catch()
	async isAuthenticated() {
		const token = this.metadata.bearer() ?? this.metadata.bearerFromCookies();

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

		this.context.set("session", {
			token,
			id: account.id,
			email: account.email,
			type: getAccountType(account.type),
		});

		return account;
	}

	@Catch()
	async isNotAuthenticated() {
		const token = this.metadata.bearer() ?? this.metadata.bearerFromCookies();

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
		const session = this.context.get("session");

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
			const account = await this.isAuthenticated();

			const session = this.context.get("session");

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
