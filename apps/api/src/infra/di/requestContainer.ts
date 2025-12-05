import { container, type DependencyContainer } from "tsyringe";
import { type ExecutionContext, HttpExecutionContext } from "@/domain/context";
import { makeExecutionLogger, type RootLogger } from "@/domain/modules";
import { TOKENS } from "./tokens";

export function createRequestContainer(
	httpContext: HttpContext,
): DependencyContainer {
	const childContainer = container.createChildContainer();

	childContainer.register<HttpContext>(TOKENS.HttpContext, {
		useValue: httpContext,
	});

	childContainer.register<ExecutionContext>(TOKENS.ExecutionContext, {
		useClass: HttpExecutionContext,
	});

	// Logger (scoped per request)
	const rootLogger = childContainer.resolve<RootLogger>(TOKENS.RootLogger);
	const execContext = childContainer.resolve<ExecutionContext>(
		TOKENS.ExecutionContext,
	);

	childContainer.registerInstance(
		TOKENS.Logger,
		makeExecutionLogger(rootLogger, execContext),
	);

	return childContainer;
}
