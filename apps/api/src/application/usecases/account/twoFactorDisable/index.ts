import { inject, injectable } from "tsyringe";
import type { AccountTwoFactorService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountTwoFactorDisableContractInput,
	AccountTwoFactorDisableContractOutput,
} from "./contract";

@injectable()
export class AccountTwoFactorDisableUseCase
	implements
		UseCase<
			AccountTwoFactorDisableContractInput,
			AccountTwoFactorDisableContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountTwoFactorService)
		private readonly accountTwoFactorService: AccountTwoFactorService,
	) {}

	execute(
		input: AccountTwoFactorDisableContractInput,
	): Promise<AccountTwoFactorDisableContractOutput> {
		return this.accountTwoFactorService.disableTwoFactor(input.token);
	}
}
