import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountEditCharacterContractInput,
	AccountEditCharacterContractOutput,
} from "./contract";

@injectable()
export class AccountEditCharacterUseCase
	implements
		UseCase<
			AccountEditCharacterContractInput,
			AccountEditCharacterContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(
		input: AccountEditCharacterContractInput,
	): Promise<AccountEditCharacterContractOutput> {
		await this.accountsService.updateCharacterByName(input.name, {
			comment: input.comment,
			isHidden: input.isHidden,
		});
	}
}
