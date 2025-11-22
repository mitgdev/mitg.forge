import { inject, injectable } from "tsyringe";
import type { AppLivePublisher } from "@/domain/clients/live/types";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class ConfigLiveRepository {
	private readonly eventName = "config.updated";

	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.AppLivePublisher)
		private readonly publisher: AppLivePublisher,
	) {}

	async publishConfigUpdateEvent(): Promise<void> {
		this.logger.info("[ConfigLiveRepository] Publishing config.updated event");
		return this.publisher.publish(this.eventName, {
			updatedAt: new Date(),
		});
	}

	subscribeToConfigUpdateEvents(opts: {
		signal?: AbortSignal;
		lastEventId?: string;
	}) {
		this.logger.info(
			"[ConfigLiveRepository] Subscribing to config.updated events",
		);
		return this.publisher.subscribe(this.eventName, opts);
	}
}
