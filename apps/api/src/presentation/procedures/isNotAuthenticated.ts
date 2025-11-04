import { oo } from "@orpc/openapi";
import { base } from "@/infra/rpc/base";
import { isNotAuthenticatedMiddleware } from "@/presentation/middlewares/isNotAuthenticated";

export const isNotAuthenticatedProcedure = base
	.errors({
		FORBIDDEN: oo.spec({}, {}),
	})
	.use(isNotAuthenticatedMiddleware);
