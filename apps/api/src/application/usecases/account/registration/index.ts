import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { ExecutionContext } from "@/domain/context";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountRegistrationKeyContractInput,
	AccountRegistrationKeyContractOutput,
} from "./contract";

@injectable()
export class AccountRegistrationUseCase
	implements
		UseCase<
			AccountRegistrationKeyContractInput,
			AccountRegistrationKeyContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
	) {}

	async execute(
		input: AccountRegistrationKeyContractInput,
	): Promise<AccountRegistrationKeyContractOutput> {
		const session = this.executionContext.session();

		return this.accountsService.upsertRegistration(session.email, input);
	}
}
