import { inject, injectable } from "tsyringe";
import type { AccountTwoFactorService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountTwoFactorSetupInput,
	AccountTwoFactorSetupOutput,
} from "./contract";

@injectable()
export class AccountTwoFactorSetupUseCase
	implements UseCase<AccountTwoFactorSetupInput, AccountTwoFactorSetupOutput>
{
	constructor(
		@inject(TOKENS.AccountTwoFactorService)
		private readonly accountTwoFactorService: AccountTwoFactorService,
	) {}

	execute(
		input: AccountTwoFactorSetupInput,
	): Promise<AccountTwoFactorSetupOutput> {
		return this.accountTwoFactorService.setupTwoFactor({
			recoveryKey: input.recoveryKey,
		});
	}
}
