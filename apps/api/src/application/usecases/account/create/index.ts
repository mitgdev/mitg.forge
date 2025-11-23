import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountCreateContractInput,
	AccountCreateContractOutput,
} from "./contract";

@injectable()
export class AccountCreateUseCase
	implements UseCase<AccountCreateContractInput, AccountCreateContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountService: AccountsService,
	) {}

	async execute(
		input: AccountCreateContractInput,
	): Promise<AccountCreateContractOutput> {
		/**
		 * TODO: Also, we might want to handle suspicious account creation patterns,
		 * like rate limiting or checking against known disposable email providers.
		 */
		await this.accountService.create({
			email: input.email,
			name: input.name,
			password: input.password,
		});
	}
}
