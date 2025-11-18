import { container, Lifecycle } from "tsyringe";
import {
	Mailer,
	makePrisma,
	makeRedis,
	type Prisma,
	type Redis,
} from "@/domain/clients";
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

	container.registerInstance(TOKENS.RootLogger, rootLogger);
	container.registerInstance(TOKENS.Logger, rootLogger);
	container.registerInstance(TOKENS.Prisma, prisma);
	container.registerInstance(TOKENS.Redis, redis);
	container.registerInstance(TOKENS.BullConnection, redis);
	container.register(
		TOKENS.Mailer,
		{ useClass: Mailer },
		{ lifecycle: Lifecycle.Singleton },
	);
}
