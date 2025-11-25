import { base } from "@/infra/rpc/base";
import { changePasswordWithOldRoute } from "./changeWithOld";

export const accountPasswordRoutes = base.prefix("/password").router({
	changeWithOld: changePasswordWithOldRoute,
});
