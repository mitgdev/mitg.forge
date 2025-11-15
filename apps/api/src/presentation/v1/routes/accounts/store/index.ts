import { base } from "@/infra/rpc/base";
import { storeHistoryRoute } from "./history";

export const accountsStoreRoutes = base.prefix("/store").router({
	history: storeHistoryRoute,
});
