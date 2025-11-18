import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountPermissionedContractInput,
	AccountPermissionedContractOutput,
} from "./contract";

@injectable()
export class AccountPermissionedUseCase
	implements
		UseCase<AccountPermissionedContractInput, AccountPermissionedContractOutput>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	async execute(
		input: AccountPermissionedContractInput,
	): Promise<AccountPermissionedContractOutput> {
		return await this.accountsService.hasPermission(input.permission);
	}
}
