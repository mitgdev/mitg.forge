import { inject, injectable } from "tsyringe";
import type { LostAccountService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountResetTwoFactorWithRecoveryKeyContractInput,
	LostAccountResetTwoFactorWithRecoveryKeyContractOutput,
} from "./contract";

@injectable()
export class LostAccountResetTwoFactorWithRecoveryKeyUseCase
	implements
		UseCase<
			LostAccountResetTwoFactorWithRecoveryKeyContractInput,
			LostAccountResetTwoFactorWithRecoveryKeyContractOutput
		>
{
	constructor(
		@inject(TOKENS.LostAccountService)
		private readonly lostAccountService: LostAccountService,
	) {}

	execute(
		input: LostAccountResetTwoFactorWithRecoveryKeyContractInput,
	): Promise<LostAccountResetTwoFactorWithRecoveryKeyContractOutput> {
		return this.lostAccountService.reset2FAWithRecoveryKey(
			input.email,
			input.recoveryKey,
		);
	}
}
