import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type {
	ConfigLiveRepository,
	ConfigRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { MiforgeConfig } from "@/shared/schemas/Config";

@injectable()
export class ConfigService {
	constructor(
		@inject(TOKENS.ConfigLiveRepository)
		private readonly publisher: ConfigLiveRepository,
		@inject(TOKENS.ConfigRepository)
		private readonly configRepository: ConfigRepository,
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
		await this.configRepository.updateConfig(input);
		await this.publisher.publishConfigUpdateEvent();
	}

	@Catch()
	async config(): Promise<MiforgeConfig> {
		return this.configRepository.findConfig();
	}
}
