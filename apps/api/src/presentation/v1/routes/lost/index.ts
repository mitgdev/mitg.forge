import { base } from "@/infra/rpc/base";
import { findByEmailOrCharacterNameRoute } from "./findByEmailOrCharacterName";
import { generatePasswordResetRoute } from "./generatePasswordReset";

export const lostAccountRouter = base
	.tag("Lost Account")
	.prefix("/lost")
	.router({
		findByEmailOrCharacterName: findByEmailOrCharacterNameRoute,
		generatePasswordReset: generatePasswordResetRoute,
	});
