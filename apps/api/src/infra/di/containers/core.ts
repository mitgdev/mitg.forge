import { IORedisPublisher } from "@orpc/experimental-publisher/ioredis";
import { container, Lifecycle } from "tsyringe";
import {
	Mailer,
	makePrisma,
	makeRedis,
	type Prisma,
	type Redis,
} from "@/domain/clients";
import type { AppEvents } from "@/domain/clients/live/types";
import { RootLogger } from "@/domain/modules";
import { env } from "@/infra/env";
import { TOKENS } from "../tokens";

export function registerCore() {
	const rootLogger = new RootLogger({
		level: env.LOG_LEVEL,
		base: { service: env.SERVICE_NAME },
	});

	const prisma: Prisma = global.__PRISMA__ ?? makePrisma(rootLogger);
	if (env.isDev) {
		rootLogger.info("[Prisma]: Using shared Prisma instance for development");
		global.__PRISMA__ = prisma;
	}

	const redis: Redis = global.__REDIS__ ?? makeRedis(rootLogger);
	if (env.isDev) {
		rootLogger.info("[Redis]: Using shared Redis instance for development");
		global.__REDIS__ = redis;
	}

	const redisSub: Redis = global.__REDIS_SUB__ ?? makeRedis(rootLogger);
	if (env.isDev) {
		rootLogger.info(
			"[Redis]: Using shared Redis Subscriber instance for development",
		);
		global.__REDIS_SUB__ = redisSub;
	}

	container.registerInstance(TOKENS.RootLogger, rootLogger);
	container.registerInstance(TOKENS.Logger, rootLogger);
	container.registerInstance(TOKENS.Prisma, prisma);
	container.registerInstance(TOKENS.Redis, redis);
	container.registerInstance(TOKENS.BullConnection, redis);

	container.registerInstance(TOKENS.EventCommander, redis);
	container.registerInstance(TOKENS.EventSubscriber, redisSub);

	container.register(TOKENS.AppLivePublisher, {
		useFactory: (c) => {
			return new IORedisPublisher<AppEvents>({
				commander: c.resolve<Redis>(TOKENS.EventCommander),
				listener: c.resolve<Redis>(TOKENS.EventSubscriber),
				resumeRetentionSeconds: 60 * 2, // 2 minutes
				prefix: env.REDIS_PUBLISHER_LIVE_PREFIX,
			});
		},
	});

	container.register(
		TOKENS.Mailer,
		{ useClass: Mailer },
		{ lifecycle: Lifecycle.Singleton },
	);
}
