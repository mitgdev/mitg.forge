import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { Metadata } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountDetailsContractInput,
	AccountDetailsContractOutput,
} from "./contract";

@injectable()
export class AccountDetailsBySessionUseCase
	implements UseCase<AccountDetailsContractInput, AccountDetailsContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
	) {}

	async execute(): Promise<AccountDetailsContractOutput> {
		const session = this.metadata.session();

		return this.accountsService.details(session.email);
	}
}
