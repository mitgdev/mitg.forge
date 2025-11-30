import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { EmailLinks, RandomCode } from "@/domain/modules";
import type {
	AccountConfirmationsRepository,
	AccountRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { EmailQueue } from "@/jobs/queue";

@injectable()
export class LostAccountService {
	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.RandomCode) private readonly randomCode: RandomCode,
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
		@inject(TOKENS.EmailQueue) private readonly emailQueue: EmailQueue,
		@inject(TOKENS.EmailLinks) private readonly emailLinks: EmailLinks,
	) {}

	private async accountExistis(emailOrCharacterName: string) {
		const account =
			(await this.accountRepository.findByEmail(emailOrCharacterName)) ??
			(await this.accountRepository.findByCharacterName(emailOrCharacterName));

		return account;
	}

	@Catch()
	async findByEmailOrPlayerName(identifier: string) {
		const account = await this.accountExistis(identifier);

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
		const account = await this.accountExistis(identifier);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "No records found for the provided value.",
			});
		}

		const resetToken = this.randomCode.generate(24, "HASH");
		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + 30);

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

		await this.accountConfirmationsRepository.create(account.id, {
			channel: "LINK",
			type: "LOST_PASSWORD_RESET",
			token: resetToken,
			expiresAt,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "LostAccountPasswordReset",
			props: {
				link: this.emailLinks.links.lostPasswordReset(resetToken),
			},
			to: account.email,
			subject: "Password Reset Request",
		});
	}
}
