import { isIP } from "node:net"; // Importing the isIP function to validate IP addresses
import { ORPCError } from "@orpc/client";
import { getConnInfo } from "hono/bun";
import type { ConnInfo } from "hono/conninfo";
import { inject, injectable } from "tsyringe";
import type { Cookies } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { ExecutionContext, ExecutionSource } from "./types";

@injectable()
export class HttpExecutionContext implements ExecutionContext {
	constructor(
		@inject(TOKENS.HttpContext) private readonly httpContext: HttpContext,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
	) {}

	source(): ExecutionSource {
		return "http";
	}

	private normalizeIp(ip: string): string {
		// IPv4 mapeado em IPv6: ::ffff:10.0.1.8
		if (ip.startsWith("::ffff:")) {
			return ip.slice("::ffff:".length);
		}

		// loopback IPv6
		if (ip === "::1") {
			return "127.0.0.1";
		}

		return ip;
	}

	/**
	 * TODO: Add support to only supported proxies from env config.
	 * Currently, it trusts all proxies which may not be secure.
	 */
	ip(): string | null {
		let info: ConnInfo | null = null;

		try {
			info = getConnInfo(this.httpContext);
		} catch {
			info = null;
		}

		const possibleIpHeaders = [
			"cf-connecting-ip", // Cloudflare
			"x-real-ip", // Nginx / proxies
			"x-forwarded-for", // lista de IPs (cliente, proxy1, proxy2...)
			"fastly-client-ip",
			"true-client-ip",
			"x-client-ip",
		];

		for (const header of possibleIpHeaders) {
			const value = this.httpContext.req.header(header);
			if (!value) continue;

			const firstIp = value.split(",")[0].trim();

			if (firstIp && isIP(firstIp)) {
				// Validate the IP address format
				return this.normalizeIp(firstIp);
			}
		}

		if (info?.remote.address && isIP(info.remote.address)) {
			// Validate the remote address format
			return this.normalizeIp(info.remote.address);
		}

		return null;
	}

	userAgent(): string | null {
		return this.httpContext.req.header("user-agent") ?? null;
	}

	requestId(): string | null {
		return this.httpContext.get("requestId") ?? null;
	}

	bearer(): string | null {
		const authHeader = this.httpContext.req.header("authorization");
		if (!authHeader) return null;

		const [type, token] = authHeader.split(" ");
		if (type.toLowerCase() !== "bearer") {
			return null;
		}

		return token;
	}

	bearerFromCookies(): string | null {
		const token = this.cookies.get(env.SESSION_TOKEN_NAME, {
			namePrefix: true,
		});

		return token;
	}

	sessionOrNull(): AuthenticatedSession | null {
		const session = this.httpContext.get("session");

		if (!session) {
			return null;
		}

		return session;
	}

	session(): AuthenticatedSession {
		const session = this.httpContext.get("session");

		if (!session) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No authenticated session found",
			});
		}

		return session;
	}
}
