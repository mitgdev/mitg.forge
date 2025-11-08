import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";
import type {
	SessionInfoContractInput,
	SessionInfoContractOutput,
} from "./contract";

@injectable()
export class SessionInfoUseCase
	implements UseCase<SessionInfoContractInput, SessionInfoContractOutput>
{
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute(): Promise<SessionInfoContractOutput> {
		return this.sessionService.info();
	}
}
