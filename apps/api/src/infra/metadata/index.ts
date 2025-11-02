import { ORPCError } from "@orpc/client";
import { getConnInfo } from "hono/bun";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/di/tokens";
import { env } from "@/env";
import type { Cookies } from "../cookies";

@injectable()
export class Metadata {
	constructor(
		@inject(TOKENS.Context) private readonly context: ReqContext,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
	) {}

	public ip(): string | null {
		const info = getConnInfo(this.context);
		const possibleIpHeaders = [
			"remoteAddress",
			"x-forwarded-for",
			"cf-connecting-ip",
			"x-real-ip",
			"fastly-client-ip",
			"true-client-ip",
			"x-client-ip",
		];

		if (info.remote.address) {
			return info.remote.address;
		}

		return possibleIpHeaders.reduce<string | null>((foundIp, header) => {
			if (foundIp) return foundIp;
			const ip = this.context.req.header(header);
			return ip ?? null;
		}, null);
	}

	public userAgent(): string | null {
		return this.context.req.header("user-agent") ?? null;
	}

	public requestId(): string | null {
		return this.context.get("requestId") ?? null;
	}

	public bearer(): string | null {
		const authHeader = this.context.req.header("authorization");
		if (!authHeader) return null;

		const [type, token] = authHeader.split(" ");
		if (type.toLowerCase() !== "bearer") {
			return null;
		}

		return token;
	}

	public bearerFromCookies(): string | null {
		const token = this.cookies.get(env.SESSION_TOKEN_NAME, {
			namePrefix: true,
		});

		return token;
	}

	public session(): AuthenticatedSession {
		const session = this.context.get("session");

		if (!session) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No authenticated session found",
			});
		}

		return session;
	}
}
