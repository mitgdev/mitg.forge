import { inject, injectable } from "tsyringe";
import type { AccountsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	ChangePasswordWithOldContractInput,
	ChangePasswordWithOldContractOutput,
} from "./contract";

@injectable()
export class ChangePasswordWithOldUseCase
	implements
		UseCase<
			ChangePasswordWithOldContractInput,
			ChangePasswordWithOldContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountsService)
		private readonly accountService: AccountsService,
	) {}

	async execute(
		input: ChangePasswordWithOldContractInput,
	): Promise<ChangePasswordWithOldContractOutput> {
		await this.accountService.changePasswordWithOld({
			newPassword: input.newPassword,
			oldPassword: input.oldPassword,
		});
	}
}
