import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountPreviewEmailChangeContractInput,
	AccountPreviewEmailChangeContractOutput,
} from "./contract";

@injectable()
export class AccountPreviewEmailChangeUseCase
	implements
		UseCase<
			AccountPreviewEmailChangeContractInput,
			AccountPreviewEmailChangeContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(
		input: AccountPreviewEmailChangeContractInput,
	): Promise<AccountPreviewEmailChangeContractOutput> {
		return this.accountsService.previewEmailChange(input.token);
	}
}
