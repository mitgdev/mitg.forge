import { container, type DependencyContainer, Lifecycle } from "tsyringe";
import {
	AccountsService,
	PlayersService,
	SessionService,
	TibiaClientService,
	WorldsService,
} from "@/application/services";
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
import {
	Mailer,
	makePrisma,
	makeRedis,
	type Prisma,
	type Redis,
} from "@/domain/modules/clients";
import { Cookies } from "@/domain/modules/cookies";
import { HasherCrypto } from "@/domain/modules/crypto/hasher";
import { JwtCrypto } from "@/domain/modules/crypto/jwt";
import { RecoveryKey } from "@/domain/modules/crypto/recoveryKey";
import { DetectionChanges } from "@/domain/modules/detection/changes";
import { PlayerNameDetection } from "@/domain/modules/detection/playerName";
import { RootLogger } from "@/domain/modules/logging/logger";
import { makeRequestLogger } from "@/domain/modules/logging/request-logger";
import { Metadata } from "@/domain/modules/metadata";
import { Pagination } from "@/domain/modules/pagination";
import {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import { AccountRegistrationRepository } from "@/domain/repositories/accountRegistration";
import { WorldsRepository } from "@/domain/repositories/worlds";
import { env } from "@/infra/env";
import { EmailQueue } from "@/jobs/queue/email.queue";
import { EmailWorker } from "@/jobs/workers/email.worker";
import { TOKENS } from "./tokens";

declare global {
	var __REDIS__: Redis | undefined;
	var __PRISMA__: Prisma | undefined;
	var __BOOTSTRAPPED__: boolean | undefined;
}

export function bootstrapContainer() {
	if (env.isDev) {
		container.clearInstances();
	}

	const rootLogger = new RootLogger({
		level: env.LOG_LEVEL,
		base: { service: env.SERVICE_NAME },
	});

	const prisma: Prisma = global.__PRISMA__ ?? makePrisma(rootLogger);
	if (env.isDev) {
		rootLogger.info("[Prisma]: Using shared Prisma instance for development");
		global.__PRISMA__ = prisma;
	}

	const redis: Redis = global.__REDIS__ ?? makeRedis(rootLogger);
	if (env.isDev) {
		rootLogger.info("[Redis]: Using shared Redis instance for development");
		global.__REDIS__ = redis;
	}

	container.registerInstance(TOKENS.RootLogger, rootLogger);
	container.registerInstance(TOKENS.Logger, rootLogger);
	container.registerInstance(TOKENS.Prisma, prisma);
	container.registerInstance(TOKENS.Redis, redis);
	container.registerInstance(TOKENS.BullConnection, redis);

	// Mailer
	container.register(
		TOKENS.Mailer,
		{ useClass: Mailer },
		{ lifecycle: Lifecycle.Singleton },
	);

	// Queues
	container.register(
		TOKENS.EmailQueue,
		{ useClass: EmailQueue },
		{ lifecycle: Lifecycle.Singleton },
	);

	// Workers
	container.register(
		TOKENS.EmailWorker,
		{ useClass: EmailWorker },
		{ lifecycle: Lifecycle.Singleton },
	);

	// Registrations “globais” que não dependem de request:
	container.register(
		TOKENS.HasherCrypto,
		{ useClass: HasherCrypto },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.JwtCrypto,
		{ useClass: JwtCrypto },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.RecoveryKey,
		{ useClass: RecoveryKey },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.DetectionChanges,
		{ useClass: DetectionChanges },
		{ lifecycle: Lifecycle.Singleton },
	);
	container.register(
		TOKENS.PlayerNameDetection,
		{ useClass: PlayerNameDetection },
		{ lifecycle: Lifecycle.Singleton },
	);

	global.__BOOTSTRAPPED__ = true;
	return container;
}

export function createRequestContainer(
	context: ReqContext,
): DependencyContainer {
	const childContainer = container.createChildContainer();

	childContainer.register<ReqContext>(TOKENS.Context, { useValue: context });

	// Logger (scoped per request)
	const rootLogger = childContainer.resolve<RootLogger>(TOKENS.RootLogger);
	childContainer.registerInstance(
		TOKENS.Logger,
		makeRequestLogger(rootLogger, context),
	);

	// Additional Infra (scoped per request)
	childContainer.register(
		TOKENS.Metadata,
		{ useClass: Metadata },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.Cookies,
		{ useClass: Cookies },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.Pagination,
		{ useClass: Pagination },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	// Repositórios (scoped per request)
	childContainer.register(
		TOKENS.AccountRepository,
		{ useClass: AccountRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountRegistrationRepository,
		{ useClass: AccountRegistrationRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.PlayersRepository,
		{ useClass: PlayersRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.SessionRepository,
		{ useClass: SessionRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.WorldsRepository,
		{ useClass: WorldsRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	// Serviços de domínio (scoped per request)
	childContainer.register(
		TOKENS.TibiaClientService,
		{ useClass: TibiaClientService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountsService,
		{ useClass: AccountsService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.SessionService,
		{ useClass: SessionService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.WorldsService,
		{ useClass: WorldsService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.PlayersService,
		{ useClass: PlayersService },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	// UseCases (scoped per request)
	childContainer.register(
		TOKENS.AccountLoginUseCase,
		{ useClass: AccountLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountDetailsBySessionUseCase,
		{ useClass: AccountDetailsBySessionUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountLogoutUseCase,
		{ useClass: AccountLogoutUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountPermissionedUseCase,
		{ useClass: AccountPermissionedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountCharactersBySessionUseCase,
		{ useClass: AccountCharactersBySessionUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountStoreHistoryUseCase,
		{ useClass: AccountStoreHistoryUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountCreateCharacterUseCase,
		{ useClass: AccountCreateCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountFindCharacterUseCase,
		{ useClass: AccountFindCharacterUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	childContainer.register(
		TOKENS.SessionInfoUseCase,
		{ useClass: SessionInfoUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.SessionAuthenticatedUseCase,
		{ useClass: SessionAuthenticatedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.SessionNotAuthenticatedUseCase,
		{ useClass: SessionNotAuthenticatedUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.AccountRegistrationUseCase,
		{ useClass: AccountRegistrationUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	childContainer.register(
		TOKENS.WorldsListUseCase,
		{ useClass: WorldsListUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	childContainer.register(
		TOKENS.TibiaLoginUseCase,
		{ useClass: TibiaLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	return childContainer;
}
