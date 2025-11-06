import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { SessionInfoOutput } from "@/presentation/routes/v1/session/info/schema";
import type { UseCase } from "@/shared/interfaces/usecase";

@injectable()
export class SessionInfoUseCase implements UseCase<void, SessionInfoOutput> {
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute(): Promise<SessionInfoOutput> {
		return this.sessionService.info();
	}
}
