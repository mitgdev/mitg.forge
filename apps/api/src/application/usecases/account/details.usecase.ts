import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { AccountDetailsOutput } from "@/presentation/routes/v1/accounts/details/schema";
import type { UseCase } from "@/shared/interfaces/usecase";

@injectable()
export class AccountDetailsUseCase
	implements UseCase<void, AccountDetailsOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(): Promise<AccountDetailsOutput> {
		return this.accountsService.details();
	}
}
