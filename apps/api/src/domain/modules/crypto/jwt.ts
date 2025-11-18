// TODO - Refactor to use hono/jwt
import * as jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

type ExtendedJwt<T> = jwt.JwtPayload & T;

@injectable()
export class JwtCrypto {
	private readonly secret: string = env.JWT_SECRET;

	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {}

	private makeIssuer(): string {
		return "miforge-api";
	}

	public generate(
		payload: Record<string, unknown>,
		options?: jwt.SignOptions,
	): string {
		return jwt.sign(payload, this.secret, {
			...options,
			issuer: this.makeIssuer(),
		});
	}

	public verify<T>(token: string): ExtendedJwt<T> | null {
		try {
			return jwt.verify(token, this.secret, {
				issuer: this.makeIssuer(),
			}) as ExtendedJwt<T>;
		} catch (error) {
			this.logger.error("JWT verification failed", { error });
			return null;
		}
	}

	public decode<T>(token: string): ExtendedJwt<T> | null {
		try {
			return jwt.decode(token) as ExtendedJwt<T>;
		} catch (error) {
			this.logger.error("JWT decoding failed", { error });
			return null;
		}
	}
}
