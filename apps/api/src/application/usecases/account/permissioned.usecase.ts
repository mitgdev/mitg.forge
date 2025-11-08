import { inject, injectable } from "tsyringe";
import { CatchDecorator } from "@/application/decorators/Catch";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";

type AccountPermissionedInput = { permission?: Permission };

@injectable()
export class AccountPermissionedUseCase
	implements UseCase<AccountPermissionedInput, boolean>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountsService: AccountsService,
	) {}

	@CatchDecorator()
	async execute(input: AccountPermissionedInput): Promise<boolean> {
		return await this.accountsService.hasPermission(input.permission);
	}
}
