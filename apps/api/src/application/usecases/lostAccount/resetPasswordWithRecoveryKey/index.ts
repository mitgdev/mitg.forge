import { inject, injectable } from "tsyringe";
import type { LostAccountService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountResetPasswordWithRecoveryKeyContractInput,
	LostAccountResetPasswordWithRecoveryKeyContractOutput,
} from "./contract";

@injectable()
export class LostAccountResetPasswordWithRecoveryKeyUseCase
	implements
		UseCase<
			LostAccountResetPasswordWithRecoveryKeyContractInput,
			LostAccountResetPasswordWithRecoveryKeyContractOutput
		>
{
	constructor(
		@inject(TOKENS.LostAccountService)
		private readonly lostAccountService: LostAccountService,
	) {}

	execute(
		input: LostAccountResetPasswordWithRecoveryKeyContractInput,
	): Promise<LostAccountResetPasswordWithRecoveryKeyContractOutput> {
		return this.lostAccountService.changePasswordWithRecoveryKey({
			email: input.email,
			newPassword: input.newPassword,
			recoveryKey: input.recoveryKey,
		});
	}
}
