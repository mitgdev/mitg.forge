import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { AuditService } from "@/application/services/audit";
import type { RecoveryKeyService } from "@/application/services/recoveryKey";
import type { ExecutionContext } from "@/domain/context";
import type { TwoFactorAuth } from "@/domain/modules";
import { type AccountRepository, AuditAction } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { EmailQueue } from "@/jobs/queue";

@injectable()
export class AccountTwoFactorService {
	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.TwoFactorAuth) private readonly twoFactorAuth: TwoFactorAuth,
		@inject(TOKENS.AuditService) private readonly auditService: AuditService,
		@inject(TOKENS.EmailQueue) private readonly emailQueue: EmailQueue,
		@inject(TOKENS.RecoveryKeyService)
		private readonly recoveryKeyService: RecoveryKeyService,
	) {}

	@Catch()
	async confirmTwoFactor(token: string) {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findById(session.id);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		if (account.two_factor_enabled) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Two-factor authentication is already enabled",
			});
		}

		if (!account.two_factor_temp_secret) {
			throw new ORPCError("BAD_REQUEST", {
				message: "No temporary two-factor secret found",
			});
		}

		const isValid = this.twoFactorAuth.verify({
			secret: account.two_factor_temp_secret,
			token,
		});

		if (!isValid) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Invalid two-factor authentication token",
			});
		}

		await this.accountRepository.updateTwoFactor(account.id, {
			two_factor_enabled: true,
			two_factor_secret: account.two_factor_temp_secret,
			two_factor_temp_secret: null,
			two_factor_confirmed_at: new Date(),
		});

		await this.auditService.createAudit(AuditAction.ENABLED_TWO_FACTOR, {
			accountId: account.id,
			success: true,
			details: "Two-factor authentication enabled",
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountTwoFactorEnabled",
			props: {},
			to: account.email,
			subject: "Two-Factor Authentication Enabled",
		});
	}

	@Catch()
	async setupTwoFactor(data: { recoveryKey: string }) {
		const session = this.executionContext.session();

		const account =
			await this.accountRepository.findAccountByIdWithRegistrations(session.id);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		if (!account.registrations?.recoveryKey) {
			throw new ORPCError("BAD_REQUEST", {
				message:
					"Two-factor authentication setup requires a recovery key. Please set up a recovery key first.",
			});
		}

		const isRecoveryKeyValid = await this.recoveryKeyService.isValid(
			data.recoveryKey,
			account.registrations.recoveryKey,
		);

		if (!isRecoveryKeyValid) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Invalid recovery key provided.",
			});
		}

		if (account.two_factor_enabled) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Two-factor authentication is already enabled",
			});
		}

		const secret =
			account.two_factor_temp_secret ?? this.twoFactorAuth.newSecret();

		const uri = this.twoFactorAuth.generateURI({
			secret,
			identifier: account.email,
		});

		if (!account.two_factor_temp_secret) {
			await this.accountRepository.updateTwoFactor(account.id, {
				two_factor_temp_secret: secret,
			});
		}

		return {
			uri,
		};
	}

	@Catch()
	async disableTwoFactor(token: string) {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findById(session.id);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		if (!account.two_factor_enabled || !account.two_factor_secret) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Two-factor authentication is not enabled",
			});
		}

		const isValid = this.twoFactorAuth.verify({
			secret: account.two_factor_secret,
			token,
		});

		if (!isValid) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Invalid two-factor authentication token",
			});
		}

		await this.accountRepository.updateTwoFactor(account.id, {
			two_factor_enabled: false,
			two_factor_secret: null,
			two_factor_temp_secret: null,
			two_factor_confirmed_at: null,
		});

		await this.auditService.createAudit(AuditAction.DISABLED_TWO_FACTOR, {
			accountId: account.id,
			success: true,
			details: "Two-factor authentication disabled",
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountTwoFactorDisabled",
			props: {},
			to: account.email,
			subject: "Two-Factor Authentication Disabled",
		});
	}
}
