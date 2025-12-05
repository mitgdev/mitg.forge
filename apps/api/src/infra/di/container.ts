import { container } from "tsyringe";

import type { Prisma, Redis } from "@/domain/clients";

import { env } from "@/infra/env";
import {
	registerClients,
	registerCore,
	registerJobs,
	registerModules,
	registerRepositories,
	registerServices,
	registerUseCases,
} from "./containers";

declare global {
	var __REDIS__: Redis | undefined;
	var __REDIS_SUB__: Redis | undefined;
	var __PRISMA__: Prisma | undefined;
	var __BOOTSTRAPPED__: boolean | undefined;
}

export function bootstrapContainer() {
	if (env.isDev) {
		container.clearInstances();
	}

	registerCore();
	registerClients();
	registerJobs();
	registerModules();
	registerRepositories();
	registerServices();
	registerUseCases();

	global.__BOOTSTRAPPED__ = true;
	return container;
}
