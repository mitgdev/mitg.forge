import { base } from "@/infra/rpc/base";
import { infoRoute } from "./info";

export const sessionRouter = base.prefix("/session").tag("Session").router({
	info: infoRoute,
});
