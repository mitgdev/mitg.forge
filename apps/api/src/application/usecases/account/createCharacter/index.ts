import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { ExecutionContext } from "@/domain/context";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountCreateCharacterContractInput,
	AccountCreateCharacterContractOutput,
} from "./contract";

@injectable()
export class AccountCreateCharacterUseCase
	implements
		UseCase<
			AccountCreateCharacterContractInput,
			AccountCreateCharacterContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
	) {}

	async execute(
		input: AccountCreateCharacterContractInput,
	): Promise<AccountCreateCharacterContractOutput> {
		const session = this.executionContext.session();
		await this.accountsService.createCharacter(session.email, input);
	}
}
