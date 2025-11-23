import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountConfirmEmailContractInput,
	AccountConfirmEmailContractOutput,
} from "./contract";

@injectable()
export class AccountConfirmEmailUseCase
	implements
		UseCase<AccountConfirmEmailContractInput, AccountConfirmEmailContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(input: AccountConfirmEmailContractInput): Promise<void> {
		await this.accountsService.verifyEmail(input.email, input.token);
	}
}
