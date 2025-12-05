import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountConfirmEmailChangeContractInput,
	AccountConfirmEmailChangeContractOutput,
} from "./contract";

@injectable()
export class AccountConfirmEmailChangeUseCase
	implements
		UseCase<
			AccountConfirmEmailChangeContractInput,
			AccountConfirmEmailChangeContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	execute(
		input: AccountConfirmEmailChangeContractInput,
	): Promise<AccountConfirmEmailChangeContractOutput> {
		return this.accountsService.confirmEmailChange(input.token);
	}
}
