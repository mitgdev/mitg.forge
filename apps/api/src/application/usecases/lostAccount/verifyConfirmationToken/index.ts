import { inject, injectable } from "tsyringe";
import type { AccountConfirmationsService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	LostAccountVerifyConfirmationTokenContractInput,
	LostAccountVerifyConfirmationTokenContractOutput,
} from "./contract";

@injectable()
export class LostAccountVerifyConfirmationTokenUseCase
	implements
		UseCase<
			LostAccountVerifyConfirmationTokenContractInput,
			LostAccountVerifyConfirmationTokenContractOutput
		>
{
	constructor(
		@inject(TOKENS.AccountConfirmationsService)
		private readonly accountConfirmationsService: AccountConfirmationsService,
	) {}

	execute(
		input: LostAccountVerifyConfirmationTokenContractInput,
	): Promise<LostAccountVerifyConfirmationTokenContractOutput> {
		return this.accountConfirmationsService.isValid(input.token);
	}
}
