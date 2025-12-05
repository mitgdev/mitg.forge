import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	SessionCanBeAuthenticatedContractInput,
	SessionCanBeAuthenticatedContractOutput,
} from "./contract";

@injectable()
export class SessionCanBeAuthenticatedUseCase
	implements
		UseCase<
			SessionCanBeAuthenticatedContractInput,
			SessionCanBeAuthenticatedContractOutput
		>
{
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute(): Promise<SessionCanBeAuthenticatedContractOutput> {
		return this.sessionService.setSessionIfExists();
	}
}
