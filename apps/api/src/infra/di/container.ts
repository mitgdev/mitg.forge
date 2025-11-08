import { container, type DependencyContainer, Lifecycle } from "tsyringe";
import {
	AccountsService,
	SessionService,
	TibiaClientService,
} from "@/application/services";
import {
	AccountCharactersBySessionUseCase,
	AccountDetailsBySessionUseCase,
	AccountPermissionedUseCase,
	SessionAuthenticatedUseCase,
	SessionInfoUseCase,
	SessionNotAuthenticatedUseCase,
	TibiaLoginUseCase,
} from "@/application/usecases";
import { AccountLoginUseCase } from "@/application/usecases/account/login";
import { AccountLogoutUseCase } from "@/application/usecases/account/logout";
import { makePrisma, type Prisma } from "@/domain/modules/clients";
import { Cookies } from "@/domain/modules/cookies";
import { HasherCrypto } from "@/domain/modules/crypto/hasher";
import { JwtCrypto } from "@/domain/modules/crypto/jwt";
import { RootLogger } from "@/domain/modules/logging/logger";
import { makeRequestLogger } from "@/domain/modules/logging/request-logger";
import { Metadata } from "@/domain/modules/metadata";
import { Pagination } from "@/domain/modules/pagination";
import {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import { env } from "@/infra/env";
import { TOKENS } from "./tokens";

declare global {
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
		global.__PRISMA__ = prisma;
	}

	container.registerInstance(TOKENS.RootLogger, rootLogger);
	container.registerInstance(TOKENS.Prisma, prisma);

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
		TOKENS.PlayersRepository,
		{ useClass: PlayersRepository },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);
	childContainer.register(
		TOKENS.SessionRepository,
		{ useClass: SessionRepository },
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
		TOKENS.TibiaLoginUseCase,
		{ useClass: TibiaLoginUseCase },
		{ lifecycle: Lifecycle.ResolutionScoped },
	);

	return childContainer;
}
