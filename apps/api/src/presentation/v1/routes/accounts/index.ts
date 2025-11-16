import { base } from "@/infra/rpc/base";
import { accountCharactersRoutes } from "./characters";
import { detailsRoute } from "./details";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { accountRegistrationKey } from "./registrationKey";
import { accountsStoreRoutes } from "./store";

export const accountsRouter = base.prefix("/accounts").tag("Accounts").router({
	login: loginRoute,
	logout: logoutRoute,
	details: detailsRoute,
	characters: accountCharactersRoutes,
	store: accountsStoreRoutes,
	registrationKey: accountRegistrationKey,
});
