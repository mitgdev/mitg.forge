import { container, type DependencyContainer, Lifecycle } from "tsyringe";
import { AccountsService, TibiaClientService } from "@/application/services";
import { SessionService } from "@/application/services/session";
import { makePrisma, type Prisma } from "@/domain/modules/clients";
import { Cookies } from "@/domain/modules/cookies";
import { HasherCrypto } from "@/domain/modules/crypto/hasher";
import { JwtCrypto } from "@/domain/modules/crypto/jwt";
import { RootLogger } from "@/domain/modules/logging/logger";
import { makeRequestLogger } from "@/domain/modules/logging/request-logger";
import { Metadata } from "@/domain/modules/metadata";
import {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import { env } from "@/env";
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

	return childContainer;
}
