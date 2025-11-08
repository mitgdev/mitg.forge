import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	SessionAuthenticatedContractInput,
	SessionAuthenticatedContractOutput,
} from "./contract";

@injectable()
export class SessionAuthenticatedUseCase
	implements
		UseCase<
			SessionAuthenticatedContractInput,
			SessionAuthenticatedContractOutput
		>
{
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute(): Promise<SessionAuthenticatedContractOutput> {
		return this.sessionService.isAuthenticated();
	}
}
