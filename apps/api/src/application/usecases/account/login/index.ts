import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountLoginContractInput,
	AccountLoginContractOutput,
} from "./contract";

@injectable()
export class AccountLoginUseCase
	implements UseCase<AccountLoginContractInput, AccountLoginContractOutput>
{
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute(
		input: AccountLoginContractInput,
	): Promise<AccountLoginContractOutput> {
		return this.sessionService.login({
			email: input.email,
			password: input.password,
			twoFactorToken: input.twoFactorCode,
		});
	}
}
