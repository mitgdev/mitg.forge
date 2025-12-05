import { base } from "@/infra/rpc/base";
import { canBeAuthenticatedMiddleware } from "../middlewares/canBeAuthenticated";

export const publicProcedure = base.use(canBeAuthenticatedMiddleware);
