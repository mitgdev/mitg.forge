import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountDeleteCharacterContractInput,
	AccountDeleteCharacterContractOutput,
} from "./contract";

@injectable()
export class AccountDeleteCharacterUseCase
	implements
		UseCase<
			AccountDeleteCharacterContractInput,
			AccountDeleteCharacterContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(
		input: AccountDeleteCharacterContractInput,
	): Promise<AccountDeleteCharacterContractOutput> {
		await this.accountsService.scheduleCharacterDeletionByName(
			input.name,
			input.password,
		);
	}
}
