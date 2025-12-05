import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type {
	ConfigLiveRepository,
	ConfigRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { MiforgeConfig } from "@/shared/schemas/Config";
import type { AuditService } from "../audit";

@injectable()
export class ConfigService {
	constructor(
		@inject(TOKENS.ConfigLiveRepository)
		private readonly publisher: ConfigLiveRepository,
		@inject(TOKENS.ConfigRepository)
		private readonly configRepository: ConfigRepository,
		@inject(TOKENS.AuditService) private readonly auditService: AuditService,
	) {}

	@Catch()
	async update(input: Partial<MiforgeConfig>) {
		/**
		 * In this moment this function is not available to be used.
		 * But when it will be, we need to think about security implications,
		 * like who can update the config and how to validate the input.
		 * At this moment, existis a procedure that is permissioned, wee can
		 * use when exposing this service to be sure only authorized users can update the config.
		 */
		const newConfig = await this.configRepository.updateConfig(input);

		this.auditService.createAudit("UPDATED_CONFIG", {
			success: true,
			details: "Configuration updated",
			metadata: {
				input: input,
				newConfig: newConfig,
			},
		});

		await this.publisher.publishConfigUpdateEvent();
	}

	@Catch()
	async config(): Promise<MiforgeConfig> {
		return this.configRepository.findConfig();
	}
}
