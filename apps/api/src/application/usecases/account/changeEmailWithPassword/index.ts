import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountChangeEmailWithPasswordContractInput,
	AccountChangeEmailWithPasswordContractOutput,
} from "./contract";

@injectable()
export class AccountChangeEmailWithPasswordUseCase
	implements
		UseCase<
			AccountChangeEmailWithPasswordContractInput,
			AccountChangeEmailWithPasswordContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountService: AccountsService,
	) {}

	async execute(
		input: AccountChangeEmailWithPasswordContractInput,
	): Promise<AccountChangeEmailWithPasswordContractOutput> {
		await this.accountService.changeEmailWithPassword(input);
	}
}
