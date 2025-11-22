import { base } from "@/infra/rpc/base";
import { configInfoRouter } from "./info";
import { configLiveRouter } from "./live";
import { configUpdateRouter } from "./update";

export const configRouter = base.prefix("/config").tag("Config").router({
	live: configLiveRouter,
	info: configInfoRouter,
	update: configUpdateRouter,
});
