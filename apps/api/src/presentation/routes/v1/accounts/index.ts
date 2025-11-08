import { base } from "@/infra/rpc/base";
import { charactersRoute } from "./characters";
import { detailsRoute } from "./details";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";

export const accountsRouter = base.prefix("/accounts").tag("Accounts").router({
	login: loginRoute,
	logout: logoutRoute,
	details: detailsRoute,
	characters: charactersRoute,
});
