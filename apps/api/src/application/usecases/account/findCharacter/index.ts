import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountFindCharacterContractInput,
	AccountFindCharacterContractOutput,
} from "./contract";

@injectable()
export class AccountFindCharacterUseCase
	implements
		UseCase<
			AccountFindCharacterContractInput,
			AccountFindCharacterContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountService: AccountsService,
	) {}

	async execute(
		input: AccountFindCharacterContractInput,
	): Promise<AccountFindCharacterContractOutput> {
		const character = await this.accountService.findCharacterByName(input.name);

		return character;
	}
}
