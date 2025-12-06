import { inject, injectable } from "tsyringe";
import type { LostAccountService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountChangeEmailWithRecoveryKeyContractInput,
	LostAccountChangeEmailWithRecoveryKeyContractOutput,
} from "./contract";

@injectable()
export class LostAccountChangeEmailWithRecoveryKeyUseCase
	implements
		UseCase<
			LostAccountChangeEmailWithRecoveryKeyContractInput,
			LostAccountChangeEmailWithRecoveryKeyContractOutput
		>
{
	constructor(
		@inject(TOKENS.LostAccountService)
		private readonly lostAccountService: LostAccountService,
	) {}

	execute(
		input: LostAccountChangeEmailWithRecoveryKeyContractInput,
	): Promise<LostAccountChangeEmailWithRecoveryKeyContractOutput> {
		return this.lostAccountService.changeEmailWithRecoveryKey(
			input.oldEmail,
			input.newEmail,
			input.recoveryKey,
			input.token,
		);
	}
}
