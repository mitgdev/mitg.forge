import { container, Lifecycle } from "tsyringe";
import {
	AccountConfirmationsRepository,
	AccountOauthRepository,
	AccountRegistrationRepository,
	AccountRepository,
	AuditRepository,
	ConfigLiveRepository,
	ConfigRepository,
	OtsServerRepository,
	PlayersRepository,
	SessionRepository,
	ShopOrderRepository,
	ShopPaymentOptionRepository,
} from "@/domain/repositories";
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
		TOKENS.AccountConfirmationsRepository,
		{ useClass: AccountConfirmationsRepository },
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
	container.register(
		TOKENS.OtsServerRepository,
		{ useClass: OtsServerRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountOauthRepository,
		{ useClass: AccountOauthRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.ShopOrderRepository,
		{ useClass: ShopOrderRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.ShopPaymentOptionRepository,
		{ useClass: ShopPaymentOptionRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	// Repositories with singleton lifecycle
	container.register(
		TOKENS.ConfigLiveRepository,
		{ useClass: ConfigLiveRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
}
