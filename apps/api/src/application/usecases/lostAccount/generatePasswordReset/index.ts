import { inject, injectable } from "tsyringe";
import type { LostAccountService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountGeneratePasswordResetContractInput,
	LostAccountGeneratePasswordResetContractOutput,
} from "./contract";

@injectable()
export class LostAccountGeneratePasswordResetUseCase
	implements
		UseCase<
			LostAccountGeneratePasswordResetContractInput,
			LostAccountGeneratePasswordResetContractOutput
		>
{
	constructor(
		@inject(TOKENS.LostAccountService)
		private readonly lostAccountService: LostAccountService,
	) {}

	execute(
		input: LostAccountGeneratePasswordResetContractInput,
	): Promise<LostAccountGeneratePasswordResetContractOutput> {
		return this.lostAccountService.generateResetPassword(
			input.emailOrCharacterName,
		);
	}
}
