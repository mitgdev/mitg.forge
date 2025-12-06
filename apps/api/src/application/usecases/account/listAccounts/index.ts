import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import type { Pagination } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ListAccountsContractInput,
	ListAccountsContractOutput,
} from "./contract";

@injectable()
export class ListAccountsUseCase
	implements UseCase<ListAccountsContractInput, ListAccountsContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
		@inject(TOKENS.Pagination) private readonly pagination: Pagination,
	) {}

	async execute(
		input: ListAccountsContractInput,
	): Promise<ListAccountsContractOutput> {
		const { storeHistory, total } = await this.accountsService.listAccounts({
			pagination: input,
		});

		return this.pagination.paginate(storeHistory, {
			page: input.page ?? 1,
			size: input.size ?? 10,
			total,
		});
	}
}
