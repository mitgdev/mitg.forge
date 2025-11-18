import { container, Lifecycle } from "tsyringe";
import {
	AccountsService,
	PlayersService,
	SessionService,
	TibiaClientService,
	WorldsService,
} from "@/application/services";
import { TOKENS } from "../tokens";

export function registerServices() {
	container.register(
		TOKENS.TibiaClientService,
		{ useClass: TibiaClientService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountsService,
		{ useClass: AccountsService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionService,
		{ useClass: SessionService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.WorldsService,
		{ useClass: WorldsService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.PlayersService,
		{ useClass: PlayersService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
}
