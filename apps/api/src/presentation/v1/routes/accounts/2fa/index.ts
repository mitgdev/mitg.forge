import { base } from "@/infra/rpc/base";
import { twoFactorConfirmRoute } from "./confirm";
import { twoFactorDisableRoute } from "./disabled";
import { twoFactorSetupRoute } from "./setup";

export const account2FARoutes = base.prefix("/2fa").router({
	setup: twoFactorSetupRoute,
	confirm: twoFactorConfirmRoute,
	disable: twoFactorDisableRoute,
});
