import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { EmailLinks, HasherCrypto } from "@/domain/modules";
import type {
	AccountConfirmationsRepository,
	AccountRegistrationRepository,
	AccountRepository,
	PlayersRepository,
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
		@inject(TOKENS.PlayersRepository)
		private readonly playersRepository: PlayersRepository,
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

	@Catch()
	async changeEmailWithRecoveryKey(
		oldEmail: string,
		newEmail: string,
		recoveryKey: string,
		twoFactorToken?: string,
	) {
		const account = await this.accountRepository.findByEmail(oldEmail);

		if (!account) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid recovery data",
			});
		}

		const characters =
			await this.playersRepository.allCharactersWithOnlineStatus(account.id);

		const anyCharacterOnline = characters.some((char) => char.online);

		if (anyCharacterOnline) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Cannot change email while one or more characters are online. Please log out all characters and try again.",
			});
		}

		const registration =
			await this.accountRegistrationRepository.findByAccountId(account.id);

		if (!registration?.recoveryKey) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid recovery data",
			});
		}

		const isValid = await this.recoveryKeyService.isValid(
			recoveryKey,
			registration.recoveryKey,
		);

		if (!isValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid recovery data",
			});
		}

		await this.accountTwoFactorService.validateTwoFactorToken({
			enabled: account.two_factor_enabled,
			secret: account.two_factor_secret,
			token: twoFactorToken,
		});

		await this.accountTwoFactorService.validateTwoFactorToken({
			enabled: account.two_factor_enabled,
			secret: account.two_factor_secret,
			token: twoFactorToken,
		});

		const emailAlreadyInUse =
			await this.accountRepository.findByEmail(newEmail);

		if (emailAlreadyInUse) {
			throw new ORPCError("CONFLICT", {
				message: "The new email is already in use by another account.",
			});
		}

		// Disable two-factor authentication, clear sessions, and change email
		await this.accountRepository.updateTwoFactor(account.id, {
			two_factor_enabled: false,
			two_factor_secret: null,
			two_factor_temp_secret: null,
			two_factor_confirmed_at: null,
		});
		// Clear all sessions for the account
		await this.sessionRepository.clearAllSessionByAccountId(account.id);

		await this.accountRepository.updateEmail(account.id, newEmail);

		await this.auditService.createAudit("CHANGED_EMAIL_WITH_RECOVERY_KEY", {
			details: "Email changed using recovery key for account",
			success: true,
			accountId: account.id,
			metadata: {
				oldEmail: oldEmail,
				newEmail: newEmail,
			},
		});

		await this.auditService.createAudit("DISABLED_TWO_FACTOR", {
			details:
				"Two-factor authentication disabled due to email change via recovery key",
			success: true,
			accountId: account.id,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountChangedEmail",
			props: {
				newEmail: newEmail,
			},
			subject: "Your account email has been changed using recovery key",
			to: oldEmail,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountNewEmail",
			props: {},
			subject: "New email associated with your account",
			to: newEmail,
		});
	}
}
