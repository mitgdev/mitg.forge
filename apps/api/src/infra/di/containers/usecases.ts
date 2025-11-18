import { container, Lifecycle } from "tsyringe";
import { AccountCharactersBySessionUseCase } from "@/application/usecases/account/characters";
import { AccountCreateCharacterUseCase } from "@/application/usecases/account/createCharacter";
import { AccountDetailsBySessionUseCase } from "@/application/usecases/account/details";
import { AccountFindCharacterUseCase } from "@/application/usecases/account/findCharacter";
import { AccountLoginUseCase } from "@/application/usecases/account/login";
import { AccountLogoutUseCase } from "@/application/usecases/account/logout";
import { AccountPermissionedUseCase } from "@/application/usecases/account/permissioned";
import { AccountRegistrationUseCase } from "@/application/usecases/account/registration";
import { AccountStoreHistoryUseCase } from "@/application/usecases/account/storeHistory";
import { SessionAuthenticatedUseCase } from "@/application/usecases/session/authenticated";
import { SessionInfoUseCase } from "@/application/usecases/session/info";
import { SessionNotAuthenticatedUseCase } from "@/application/usecases/session/notAuthenticated";
import { TibiaLoginUseCase } from "@/application/usecases/tibia/login";
import { WorldsListUseCase } from "@/application/usecases/worlds/list";
import { TOKENS } from "../tokens";

export function registerUseCases() {
	container.register(
		TOKENS.AccountLoginUseCase,
		{ useClass: AccountLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountDetailsBySessionUseCase,
		{ useClass: AccountDetailsBySessionUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountLogoutUseCase,
		{ useClass: AccountLogoutUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountPermissionedUseCase,
		{ useClass: AccountPermissionedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountCharactersBySessionUseCase,
		{ useClass: AccountCharactersBySessionUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountStoreHistoryUseCase,
		{ useClass: AccountStoreHistoryUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountCreateCharacterUseCase,
		{ useClass: AccountCreateCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountFindCharacterUseCase,
		{ useClass: AccountFindCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.SessionInfoUseCase,
		{ useClass: SessionInfoUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionAuthenticatedUseCase,
		{ useClass: SessionAuthenticatedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.SessionNotAuthenticatedUseCase,
		{ useClass: SessionNotAuthenticatedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	container.register(
		TOKENS.AccountRegistrationUseCase,
		{ useClass: AccountRegistrationUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.WorldsListUseCase,
		{ useClass: WorldsListUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	container.register(
		TOKENS.TibiaLoginUseCase,
		{ useClass: TibiaLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
}
