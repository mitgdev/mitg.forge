import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";

type ExtendedCookieOptions = CookieOptions & {
	namePrefix?: boolean;
};

@injectable()
export class Cookies {
	private readonly prefix: string = "miforge_";

	constructor(
		@inject(TOKENS.HttpContext) private readonly httpContext: HttpContext,
	) {}

	private getPrefixedName(name: string): string {
		return `${this.prefix}${name}`;
	}

	set(name: string, value: string, options?: ExtendedCookieOptions) {
		const namePrefix = options?.namePrefix ?? false;

		const finalName = namePrefix ? this.getPrefixedName(name) : name;

		setCookie(this.httpContext, finalName, value, {
			secure: true,
			httpOnly: true,
			sameSite: "Strict",
			...options,
		});
	}

	get(name: string, options?: ExtendedCookieOptions): string | null {
		const namePrefix = options?.namePrefix ?? false;
		const finalName = namePrefix ? this.getPrefixedName(name) : name;

		return getCookie(this.httpContext, finalName) ?? null;
	}

	delete(name: string, options?: ExtendedCookieOptions) {
		const namePrefix = options?.namePrefix ?? false;

		const finalName = namePrefix ? this.getPrefixedName(name) : name;

		deleteCookie(this.httpContext, finalName, options);
	}
}
