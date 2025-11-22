import type { DependencyContainer } from "tsyringe";
import { UseCasesFactory } from "@/application/usecases/factory";
import { createRequestContainer } from "@/infra/di/container";

export type CreateContextOptions = {
	context: ReqContext;
};

export type CreateContext = {
	usecases: UseCasesFactory;
	di: DependencyContainer;
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<CreateContext> {
	const di = createRequestContainer(context);
	const usecases = new UseCasesFactory(di);

	return {
		usecases,
		di,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
