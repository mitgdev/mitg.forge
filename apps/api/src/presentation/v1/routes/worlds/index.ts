import { base } from "@/infra/rpc/base";
import { worldsListRoute } from "./list";

export const worldsRouter = base.prefix("/worlds").tag("Worlds").router({
	list: worldsListRoute,
});
