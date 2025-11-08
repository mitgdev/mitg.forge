import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { Metadata } from "@/domain/modules/metadata";
import { TOKENS } from "@/infra/di/tokens";
import type { AccountDetailsOutput } from "@/presentation/routes/v1/accounts/details/schema";
import type { UseCase } from "@/shared/interfaces/usecase";

@injectable()
export class AccountDetailsBySessionUseCase
	implements UseCase<void, AccountDetailsOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
	) {}

	async execute(): Promise<AccountDetailsOutput> {
		const session = this.metadata.session();

		return this.accountsService.details(session.email);
	}
}
