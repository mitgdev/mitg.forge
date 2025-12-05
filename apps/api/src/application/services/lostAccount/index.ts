import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { EmailLinks, HasherCrypto } from "@/domain/modules";
import type {
	AccountConfirmationsRepository,
	AccountRegistrationRepository,
	AccountRepository,
	SessionRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { EmailQueue } from "@/jobs/queue";
import type { AccountConfirmationsService } from "../accountConfirmations";
import type { AccountTwoFactorService } from "../accountTwoFactor";
import type { AuditService } from "../audit";
import type { RecoveryKeyService } from "../recoveryKey";

@injectable()
export class LostAccountService {
	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
		@inject(TOKENS.EmailQueue) private readonly emailQueue: EmailQueue,
		@inject(TOKENS.EmailLinks) private readonly emailLinks: EmailLinks,
		@inject(TOKENS.AccountConfirmationsService)
		private readonly accountConfirmationsService: AccountConfirmationsService,
		@inject(TOKENS.HasherCrypto) private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.AuditService)
		private readonly auditService: AuditService,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
		@inject(TOKENS.AccountRegistrationRepository)
		private readonly accountRegistrationRepository: AccountRegistrationRepository,
		@inject(TOKENS.RecoveryKeyService)
		private readonly recoveryKeyService: RecoveryKeyService,
		@inject(TOKENS.AccountTwoFactorService)
		private readonly accountTwoFactorService: AccountTwoFactorService,
	) {}

	private async accountExists(emailOrCharacterName: string) {
		const account =
			await this.accountRepository.findByEmail(emailOrCharacterName);

		return account;
	}

	@Catch()
	async findByEmail(identifier: string) {
		const account = await this.accountExists(identifier);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "No records found for the provided value.",
			});
		}
	}

	@Catch()
	async generateResetPassword(identifier: string) {
		/**
		 * TODO: Add a rate limiter here, verify how many request already have been made in the past X minutes
		 * If more than allowed, throw an error
		 * Maybe when can add a Rate Limiter in router level to handle this in a generic way.
		 * Example: max 3 requests per hour per IP or per account if available
		 * Because using in router level we can also protect other use cases like login, registration, etc.
		 */
		const account = await this.accountExists(identifier);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "No records found for the provided value.",
			});
		}

		const alreadyHasResetActive =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"LOST_PASSWORD_RESET",
			);

		if (alreadyHasResetActive) {
			throw new ORPCError("CONFLICT", {
				message: "A password reset request is already active for this account.",
			});
		}

		const { expiresAt, token, tokenHash } =
			await this.accountConfirmationsService.generateTokenAndHash(30);

		await this.accountConfirmationsRepository.create(account.id, {
			channel: "LINK",
			type: "LOST_PASSWORD_RESET",
			tokenHash: tokenHash,
			expiresAt,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "LostAccountPasswordReset",
			props: {
				link: this.emailLinks.links.lostPasswordReset(token),
			},
			to: account.email,
			subject: "Password Reset Request",
		});
	}

	@Catch()
	async resetPasswordWithToken(rawToken: string, newPassword: string) {
		const confirmation =
			await this.accountConfirmationsService.isValid(rawToken);

		const account = await this.accountRepository.findById(
			confirmation.accountId,
		);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found.",
			});
		}

		const oldPassword = account.password;

		const isNewPasswordSameAsOld = this.hasherCrypto.compare(
			newPassword,
			oldPassword,
		);

		if (isNewPasswordSameAsOld) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "The new password cannot be the same as the old password.",
			});
		}

		await this.accountConfirmationsService.verifyConfirmation(
			confirmation,
			rawToken,
		);

		const hashedNewPassword = this.hasherCrypto.hash(newPassword);

		await this.accountRepository.updatePassword(account.id, hashedNewPassword);

		await this.sessionRepository.clearAllSessionByAccountId(account.id);

		await this.auditService.createAudit("LOST_RESET_PASSWORD_WITH_TOKEN", {
			details: "Password reset using lost account flow. With token generated.",
			accountId: account.id,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountPasswordChanged",
			props: {},
			subject: "Your password has been changed",
			to: account.email,
		});
	}

	@Catch()
	async changePasswordWithRecoveryKey({
		email,
		newPassword,
		recoveryKey,
	}: {
		email: string;
		recoveryKey: string;
		newPassword: string;
	}) {
		const errorMessage = "Invalid recovery data";

		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("UNAUTHORIZED", {
				message: errorMessage,
			});
		}

		const registration =
			await this.accountRegistrationRepository.findByAccountId(account.id);

		if (!registration || !registration.recoveryKey) {
			throw new ORPCError("UNAUTHORIZED", {
				message: errorMessage,
			});
		}

		const isValid = await this.recoveryKeyService.isValid(
			recoveryKey,
			registration.recoveryKey,
		);

		if (!isValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: errorMessage,
			});
		}

		const newHashedPassword = this.hasherCrypto.hash(newPassword);

		await this.accountRepository.updatePassword(account.id, newHashedPassword);

		await this.sessionRepository.clearAllSessionByAccountId(account.id);

		await this.auditService.createAudit("CHANGED_PASSWORD_WITH_RECOVERY_KEY", {
			details: "Password changed using recovery key for account",
			success: true,
			accountId: account.id,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountPasswordChanged",
			props: {},
			subject: "Your password has been changed using recovery key",
			to: account.email,
		});
	}

	@Catch()
	async reset2FAWithRecoveryKey(email: string, recoveryKey: string) {
		const message = "Invalid recovery data";
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("UNAUTHORIZED", {
				message: message,
			});
		}

		const registration =
			await this.accountRegistrationRepository.findByAccountId(account.id);

		if (!registration?.recoveryKey) {
			throw new ORPCError("UNAUTHORIZED", {
				message: message,
			});
		}

		const isValid = await this.recoveryKeyService.isValid(
			recoveryKey,
			registration.recoveryKey,
		);

		if (!isValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: message,
			});
		}

		await this.accountTwoFactorService.removeTwoFactor(account.email);
	}
}
