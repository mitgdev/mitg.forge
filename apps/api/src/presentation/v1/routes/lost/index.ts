import { base } from "@/infra/rpc/base";
import { findByEmailOrCharacterNameRoute } from "./findByEmail";
import { generatePasswordResetRoute } from "./generatePasswordReset";

export const lostAccountRouter = base
	.tag("Lost Account")
	.prefix("/lost")
	.router({
		findByEmail: findByEmailOrCharacterNameRoute,
		generatePasswordReset: generatePasswordResetRoute,
	});
