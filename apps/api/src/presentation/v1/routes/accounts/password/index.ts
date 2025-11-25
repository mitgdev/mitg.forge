import { base } from "@/infra/rpc/base";
import { changePasswordWithOldRoute } from "./changeWithOld";
import { generatePasswordResetRoute } from "./generateReset";

export const accountPasswordRoutes = base.prefix("/password").router({
	changeWithOld: changePasswordWithOldRoute,
	generateReset: generatePasswordResetRoute,
});
