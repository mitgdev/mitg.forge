import { inject, injectable } from "tsyringe";
import type { AccountTwoFactorService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountTwoFactorConfirmContractInput,
	AccountTwoFactorConfirmContractOutput,
} from "./contract";

@injectable()
export class AccountTwoFactorConfirmUseCase
	implements
		UseCase<
			AccountTwoFactorConfirmContractInput,
			AccountTwoFactorConfirmContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountTwoFactorService)
		private readonly accountTwoFactorService: AccountTwoFactorService,
	) {}

	execute(
		input: AccountTwoFactorConfirmContractInput,
	): Promise<AccountTwoFactorConfirmContractOutput> {
		return this.accountTwoFactorService.confirmTwoFactor(input.token);
	}
}
