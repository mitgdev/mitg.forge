import type { DependencyContainer } from "tsyringe";
import { UseCasesFactory } from "@/application/usecases/factory";
import { createRequestContainer } from "../di/requestContainer";

export type CreateHttpContextOptions = {
	context: HttpContext;
};

export type CreateHttpContext = {
	usecases: UseCasesFactory;
	di: DependencyContainer;
};

export async function createHttpContext({
	context,
}: CreateHttpContextOptions): Promise<CreateHttpContext> {
	const di = createRequestContainer(context);
	const usecases = new UseCasesFactory(di);

	return {
		usecases,
		di,
	};
}

export type CreatedHttpContext = CreateHttpContext;
