import { container, Lifecycle } from "tsyringe";
import {
	AccountRepository,
	AuditRepository,
	ConfigLiveRepository,
	ConfigRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import { AccountRegistrationRepository } from "@/domain/repositories/account/registration";
import { WorldsRepository } from "@/domain/repositories/worlds";
import { TOKENS } from "../tokens";

export function registerRepositories() {
	// Repositories with resolution scoped lifecycle
	container.register(
		TOKENS.AccountRepository,
		{ useClass: AccountRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountRegistrationRepository,
		{ useClass: AccountRegistrationRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.PlayersRepository,
		{ useClass: PlayersRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionRepository,
		{ useClass: SessionRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.WorldsRepository,
		{ useClass: WorldsRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AuditRepository,
		{ useClass: AuditRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.ConfigRepository,
		{ useClass: ConfigRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	// Repositories with singleton lifecycle
	container.register(
		TOKENS.ConfigLiveRepository,
		{ useClass: ConfigLiveRepository },
		{ lifecycle: Lifecycle.Singleton },
	);
}
