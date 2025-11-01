import { base } from "@/main/rpc/base";
import { infoRoute } from "./info";

export const sessionRouter = base.prefix("/session").tag("Session").router({
	info: infoRoute,
});
