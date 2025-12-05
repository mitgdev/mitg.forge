import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountGenerateEmailChangeContractInput,
	AccountGenerateEmailChangeContractOutput,
} from "./contract";

@injectable()
export class AccountGenerateEmailChangeUseCase
	implements
		UseCase<
			AccountGenerateEmailChangeContractInput,
			AccountGenerateEmailChangeContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountService: AccountsService,
	) {}

	async execute(
		input: AccountGenerateEmailChangeContractInput,
	): Promise<AccountGenerateEmailChangeContractOutput> {
		await this.accountService.generateEmailChange(input.newEmail);
	}
}
