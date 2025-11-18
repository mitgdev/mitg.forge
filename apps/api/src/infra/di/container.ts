import { container, type DependencyContainer } from "tsyringe";

import type { Prisma, Redis } from "@/domain/clients";

import type { RootLogger } from "@/domain/modules";
import { makeRequestLogger } from "@/domain/modules";
import { env } from "@/infra/env";
import {
	registerCore,
	registerJobs,
	registerModules,
	registerRepositories,
	registerServices,
	registerUseCases,
} from "./containers";
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

	registerCore();
	registerJobs();
	registerModules();
	registerRepositories();
	registerServices();
	registerUseCases();

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

	return childContainer;
}
