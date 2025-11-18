import IORedis from "ioredis";
import type { Logger } from "@/domain/modules";
import { env } from "@/infra/env";

export type Redis = IORedis;

export function makeRedis(logger?: Logger): IORedis {
	const client = new IORedis(env.REDIS_URL, {
		maxRetriesPerRequest: null,
		enableReadyCheck: true,
	});

	client.on("error", (error) => {
		logger?.error("[redis]: ", { error });
	});
	client.on("connect", () => logger?.info("[redis]: connect"));
	client.on("ready", () => logger?.info("[redis]: ready"));

	const shutdown = async () => {
		try {
			await client.quit();
		} catch {}
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);

	return client;
}
