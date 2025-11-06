import { UseCases } from "@/application/usecases";
import { createRequestContainer } from "@/infra/di/container";

export type CreateContextOptions = {
	context: ReqContext;
};

export type CreateContext = {
	usecases: UseCases;
};

export async function createContext({
	context,
}: CreateContextOptions): Promise<CreateContext> {
	const di = createRequestContainer(context);
	const usecases = new UseCases(di);

	return {
		usecases,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
