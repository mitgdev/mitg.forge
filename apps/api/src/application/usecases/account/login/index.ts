import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountLoginContractInput,
	AccountLoginContractOutput,
} from "./contract";

@injectable()
export class AccountLoginUseCase
	implements UseCase<AccountLoginContractInput, AccountLoginContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(
		input: AccountLoginContractInput,
	): Promise<AccountLoginContractOutput> {
		return this.accountsService.login({
			email: input.email,
			password: input.password,
		});
	}
}
