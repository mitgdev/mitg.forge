import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type {
	AccountLoginInput,
	AccountLoginOutput,
} from "@/presentation/routes/v1/accounts/login/schema";
import type { UseCase } from "@/shared/interfaces/usecase";

@injectable()
export class AccountLoginUseCase
	implements UseCase<AccountLoginInput, AccountLoginOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(input: AccountLoginInput): Promise<AccountLoginOutput> {
		return this.accountsService.login({
			email: input.email,
			password: input.password,
		});
	}
}
