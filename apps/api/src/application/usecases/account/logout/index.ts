import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	AccountLogoutContractInput,
	AccountLogoutContractOutput,
} from "./contract";

@injectable()
export class AccountLogoutUseCase
	implements UseCase<AccountLogoutContractInput, AccountLogoutContractOutput>
{
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute(): Promise<void> {
		return this.sessionService.logout();
	}
}
