import { base } from "@/infra/rpc/base";
import { account2FARoutes } from "./2fa";
import { auditHistoryRoute } from "./audit";
import { accountCharactersRoutes } from "./characters";
import { confirmEmailAccountRoute } from "./confirmEmail";
import { createAccountRoute } from "./create";
import { detailsRoute } from "./details";
import { emailRoutes } from "./email";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { accountPasswordRoutes } from "./password";
import { accountRegistrationKey } from "./registrationKey";
import { accountsStoreRoutes } from "./store";

export const accountsRouter = base.prefix("/accounts").tag("Accounts").router({
	create: createAccountRoute,
	login: loginRoute,
	logout: logoutRoute,
	details: detailsRoute,
	characters: accountCharactersRoutes,
	store: accountsStoreRoutes,
	registrationKey: accountRegistrationKey,
	audit: auditHistoryRoute,
	confirmEmail: confirmEmailAccountRoute,
	password: accountPasswordRoutes,
	email: emailRoutes,
	twoFactor: account2FARoutes,
});
