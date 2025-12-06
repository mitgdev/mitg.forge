import { base } from "@/infra/rpc/base";
import { listAccountsRouter } from "./list";

export const adminAccountsRouter = base.prefix("/accounts").router({
	list: listAccountsRouter,
});
