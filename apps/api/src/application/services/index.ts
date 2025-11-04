import type { DependencyContainer } from "tsyringe";
import type { Logger } from "@/domain/modules/logging/logger";

import { TOKENS } from "@/infra/di/tokens";
import { AccountsService } from "./accounts";
import type { SessionService } from "./session";
import { TibiaClientService } from "./tibiaclient";

export class Services {
	constructor(private readonly di: DependencyContainer) {}

	get tibiaClient() {
		return this.di.resolve<TibiaClientService>(TOKENS.TibiaClientService);
	}

	get accounts() {
		return this.di.resolve<AccountsService>(TOKENS.AccountsService);
	}

	get session() {
		return this.di.resolve<SessionService>(TOKENS.SessionService);
	}

	get logger() {
		return this.di.resolve<Logger>(TOKENS.Logger);
	}
}

export { AccountsService, type SessionService, TibiaClientService };
