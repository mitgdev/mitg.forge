import { injectable } from "tsyringe";
import { env } from "@/infra/env";

type KeyPart = string | number | null | undefined | false;

@injectable()
export class CacheKeys {
	private readonly appPrefix = env.SERVICE_NAME;

	private buildKey(...parts: KeyPart[]): string {
		return parts
			.filter(Boolean)
			.map((part) => String(part).trim())
			.map((p) => p.replace(/\s+/g, "-"))
			.join(":");
	}

	private namespace = {
		build: (...parts: KeyPart[]) => this.buildKey(this.appPrefix, ...parts),
	};

	readonly keys: Record<
		"config" | "serverStatus" | "outfit",
		(...parts: KeyPart[]) => { key: string; ttl: number | undefined }
	> = {
		config: () => {
			return {
				key: this.namespace.build("config"),
				ttl: 30 * 24 * 60 * 60, // 30 Days
			};
		},
		serverStatus: (...parts: KeyPart[]) => {
			return {
				key: this.namespace.build("server-status", ...parts),
				ttl: 30, // 30 Seconds
			};
		},
		outfit: (...parts: KeyPart[]) => {
			return {
				key: this.namespace.build("outfit", ...parts),
				ttl: undefined,
			};
		},
	};
}
