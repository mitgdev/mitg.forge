import type { IORedisPublisher } from "@orpc/experimental-publisher/ioredis";

export type ConfigEvents = {
	"config.updated": {
		updatedAt: Date;
	};
};

export const CONFIG_EVENT_NAMES = Object.keys({
	"config.updated": null,
}) as Array<keyof ConfigEvents>;

export type AppEvents = ConfigEvents;

export type AppLivePublisher = IORedisPublisher<AppEvents>;
