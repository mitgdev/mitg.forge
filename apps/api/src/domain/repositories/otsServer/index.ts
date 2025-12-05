import { XMLParser } from "fast-xml-parser";
import { inject, injectable } from "tsyringe";
import type { OtsServerClient } from "@/domain/clients";
import type { Cache, CacheKeys } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import type { ServerStatus } from "@/shared/schemas/ServerStatus";

@injectable()
export class OtsServerRepository {
	constructor(
		@inject(TOKENS.Cache) private readonly cache: Cache,
		@inject(TOKENS.CacheKeys) private readonly cacheKeys: CacheKeys,
		@inject(TOKENS.OtsServerClient)
		private readonly otsServerClient: OtsServerClient,
	) {}

	async status(host: string, port: number): Promise<ServerStatus> {
		const { key, ttl } = this.cacheKeys.keys.serverStatus(host, port);
		const cache = await this.cache.get<ServerStatus>(key);

		if (cache) {
			return cache.data;
		}

		const response = await this.otsServerClient.status({ host, port });

		if (!response) {
			return {
				uptime: 0,
				version: "unknown",
				client: "unknown",
				players: {
					online: 0,
					max: 0,
					record: 0,
				},
			};
		}

		const json = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "@_",
		}).parse(response);

		const status: ServerStatus = {
			uptime: Number(json?.tsqp?.serverinfo?.["@_uptime"] || 0),
			version: json?.tsqp?.serverinfo?.["@_version"] || "unknown",
			client: json?.tsqp?.serverinfo?.["@_client"] || "unknown",
			players: {
				online: Number(json?.tsqp?.players?.["@_online"] || 0),
				max: Number(json?.tsqp?.players?.["@_max"] || 0),
				record: Number(json?.tsqp?.players?.["@_peak"] || 0),
			},
		};

		await this.cache.save(key, status, ttl);

		return status;
	}
}
