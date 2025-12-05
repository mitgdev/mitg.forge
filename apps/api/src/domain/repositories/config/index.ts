import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import type { Cache, CacheKeys } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import {
	type MiforgeConfig,
	MiforgeConfigSchema,
} from "@/shared/schemas/Config";

const CONFIG_ID = 1 as const;

@injectable()
export class ConfigRepository {
	constructor(
		@inject(TOKENS.Prisma) private readonly database: Prisma,
		@inject(TOKENS.Cache) private readonly cache: Cache,
		@inject(TOKENS.CacheKeys) private readonly cacheKeys: CacheKeys,
	) {}

	private async loadFromDb(): Promise<MiforgeConfig> {
		const row = await this.database.miforge_config.findUnique({
			where: { id: CONFIG_ID },
		});

		if (!row) {
			return MiforgeConfigSchema.parse({});
		}

		if (typeof row.data !== "string") {
			return MiforgeConfigSchema.parse({});
		}

		const parsed = JSON.parse(row.data);
		return MiforgeConfigSchema.parse(parsed);
	}

	async findConfig(): Promise<MiforgeConfig> {
		const { key, ttl } = this.cacheKeys.keys.config();

		const cached = await this.cache.get<MiforgeConfig>(key);
		if (cached) {
			return cached.data;
		}

		const config = await this.loadFromDb();

		await this.cache.save<MiforgeConfig>(key, config, ttl);

		return config;
	}

	async updateConfig(patch: Partial<MiforgeConfig>): Promise<MiforgeConfig> {
		const current = await this.loadFromDb();

		const merged = MiforgeConfigSchema.parse({
			...current,
			...patch,
			mailer: {
				enabled: Boolean(env.MAILER_PROVIDER),
			},
		});

		await this.database.miforge_config.upsert({
			where: { id: CONFIG_ID },
			create: {
				id: CONFIG_ID,
				data: JSON.stringify(merged),
			},
			update: {
				data: JSON.stringify(merged),
			},
		});

		const { key, ttl } = this.cacheKeys.keys.config();
		await this.cache.save<MiforgeConfig>(key, merged, ttl);

		return merged;
	}
}
