import type { RedisKey } from "ioredis";
import { inject, injectable } from "tsyringe";
import type { Redis } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";

type Payload<T> = {
	data: T;
	timestamp: number;
	ttl: number | null;
};

@injectable()
export class Cache {
	constructor(@inject(TOKENS.Redis) private readonly redis: Redis) {}

	public async save<T>(key: string, value: T, ttl?: number): Promise<void> {
		const payload: Payload<T> = {
			data: value,
			timestamp: Date.now(),
			ttl: ttl ?? null,
		};

		if (ttl && ttl > 0) {
			await this.redis.set(key, JSON.stringify(payload), "EX", ttl);
		} else {
			await this.redis.set(key, JSON.stringify(payload));
		}
	}

	public async get<T>(key: string): Promise<Payload<T> | null> {
		const data = await this.redis.get(key);

		if (!data) {
			return null;
		}

		try {
			const parsed: Payload<T> = JSON.parse(data);

			return parsed;
		} catch {
			return null;
		}
	}

	public async delete(...keys: RedisKey[]): Promise<void> {
		await this.redis.del(...keys);
	}
}
