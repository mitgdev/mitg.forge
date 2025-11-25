import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountGeneratePasswordResetContractInput,
	AccountGeneratePasswordResetContractOutput,
} from "./contract";

@injectable()
export class AccountGeneratePasswordResetUseCase
	implements
		UseCase<
			AccountGeneratePasswordResetContractInput,
			AccountGeneratePasswordResetContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	execute(): Promise<AccountGeneratePasswordResetContractOutput> {
		return this.accountsService.generatePasswordReset();
	}
}
