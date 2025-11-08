import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import type { Cookies } from "@/domain/modules/cookies";
import type { HasherCrypto } from "@/domain/modules/crypto/hasher";
import type { JwtCrypto } from "@/domain/modules/crypto/jwt";
import type { Logger } from "@/domain/modules/logging/logger";
import type { Metadata } from "@/domain/modules/metadata";
import type {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { getAccountType, getAccountTypeId } from "@/utils/account/type";
import { CatchDecorator } from "../decorators/Catch";
import type { SessionService } from "./session.service";

@injectable()
export class AccountsService {
	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.JwtCrypto) private readonly jwtCrypto: JwtCrypto,
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
		@inject(TOKENS.PlayersRepository)
		private readonly playersRepository: PlayersRepository,
	) {}

	@CatchDecorator()
	async login({ email, password }: { email: string; password: string }) {
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
	async details(email: string) {
		const account = await this.accountRepository.details(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		/**
		 * TODO: Remove characters from this, to be in another route.
		 */
		return {
			...account,
			sessions: account.sessions,
			characters: account.players,
			store_history: account.store_history,
		};
	}

	@CatchDecorator()
	async hasPermission(permission?: Permission): Promise<boolean> {
		/**
		 * TODO: Maybe this error shouldn't be here, or the message should be different.
		 * Because this is a .service and can be used in other places than just route protection.
		 * For now, leaving as is.
		 */
		if (!permission) {
			throw new ORPCError("NOT_IMPLEMENTED", {
				message:
					"No permission defined for this route, this is likely a server misconfiguration. Please contact an administrator.",
			});
		}

		const session = this.metadata.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const accountType = account.type;
		const permissionType = getAccountTypeId(permission.type);

		if (accountType < permissionType) {
			const permissionTypeName = getAccountType(permissionType);
			const accountTypeName = getAccountType(accountType);

			throw new ORPCError("FORBIDDEN", {
				message: `You need to be at least a ${permissionTypeName} to access this resource. Your account type is ${accountTypeName}.`,
			});
		}

		return true;
	}

	@CatchDecorator()
	async characters(email: string) {
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const { characters, total } = await this.playersRepository.byAccountId(
			account.id,
		);

		const areOnline = await this.playersRepository.areOnline(
			characters.map((char) => char.id),
		);

		return {
			characters: characters.map((char) => {
				const isOnline = areOnline.includes(char.id);

				return {
					...char,
					online: isOnline,
				};
			}),
			total: total,
		};
	}
}
