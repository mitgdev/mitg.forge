import { container, Lifecycle } from "tsyringe";
import {
	AccountCharactersBySessionUseCase,
	AccountCreateCharacterUseCase,
	AccountDetailsBySessionUseCase,
	AccountEditCharacterUseCase,
	AccountFindCharacterUseCase,
	AccountLoginUseCase,
	AccountLogoutUseCase,
	AccountPermissionedUseCase,
	AccountRegistrationUseCase,
	AccountStoreHistoryUseCase,
	SessionAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
	TibiaLoginUseCase,
	WorldsListUseCase,
} from "@/application/usecases";
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
		TOKENS.AccountEditCharacterUseCase,
		{ useClass: AccountEditCharacterUseCase },
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
