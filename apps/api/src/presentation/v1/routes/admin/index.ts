import { base } from "@/infra/rpc/base";
import { adminAccountsRouter } from "./accounts";

export const adminRouter = base.prefix("/admin").tag("Admin").router({
	accounts: adminAccountsRouter,
});
