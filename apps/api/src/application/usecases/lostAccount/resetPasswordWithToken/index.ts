import { inject, injectable } from "tsyringe";
import type { LostAccountService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountResetPasswordWithTokenContractInput,
	LostAccountResetPasswordWithTokenContractOutput,
} from "./contract";

@injectable()
export class LostAccountResetPasswordWithTokenUseCase
	implements
		UseCase<
			LostAccountResetPasswordWithTokenContractInput,
			LostAccountResetPasswordWithTokenContractOutput
		>
{
	constructor(
		@inject(TOKENS.LostAccountService)
		private readonly lostAccountService: LostAccountService,
	) {}

	execute(
		input: LostAccountResetPasswordWithTokenContractInput,
	): Promise<LostAccountResetPasswordWithTokenContractOutput> {
		return this.lostAccountService.resetPasswordWithToken(
			input.token,
			input.newPassword,
		);
	}
}
