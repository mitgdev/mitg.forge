import { oo } from "@orpc/openapi";
import { base } from "@/infra/rpc/base";
import { isPermissionedMiddleware } from "@/presentation/middlewares/isPermissioned";

export const isPermissionedProcedure = base
	.errors({
		UNAUTHORIZED: oo.spec({}, {}),
		FORBIDDEN: oo.spec({}, {}),
		NOT_IMPLEMENTED: oo.spec({}, {}),
		NOT_FOUND: oo.spec({}, {}),
	})
	.use(isPermissionedMiddleware);
