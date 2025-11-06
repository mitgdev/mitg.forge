import { inject, injectable } from "tsyringe";
import type { SessionService } from "@/application/services";
import { TOKENS } from "@/infra/di/tokens";
import type { UseCase } from "@/shared/interfaces/usecase";

/**
 * TODO: Add proper input and output types
 */
@injectable()
export class SessionNotAuthenticatedUseCase implements UseCase<void, unknown> {
	constructor(
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
	) {}

	async execute() {
		return this.sessionService.isNotAuthenticated();
	}
}
