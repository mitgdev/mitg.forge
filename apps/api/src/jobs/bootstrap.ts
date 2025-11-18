import { container } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { WorkerImplementation } from "./factory";
import type { EmailWorker } from "./workers";

export const bootstrapJobs = () => {
	const logger = container.resolve<Logger>(TOKENS.Logger);
	const runningWorkers: { stop: () => Promise<void> }[] = [];

	// biome-ignore lint/suspicious/noExplicitAny: <any implementation>
	const toStartWorkers: Array<WorkerImplementation<any>> = [
		container.resolve<EmailWorker>(TOKENS.EmailWorker),
	];

	toStartWorkers.forEach((worker) => {
		const instance = worker.start();
		if (instance) {
			runningWorkers.push(worker);
			logger.info(`[Workers]: Started worker for ${instance.name}`);
		} else {
			logger.warn(
				`[Workers]: Worker for ${worker.constructor.name} did not start.`,
			);
		}
	});

	if (toStartWorkers.length === 0) {
		logger.warn("[Workers]: No job workers to start.");
		return;
	}

	const shutdown = async (signal: string) => {
		logger.info(`[Workers]: Received ${signal}, shutting down workers...`);

		await Promise.allSettled(runningWorkers.map((worker) => worker.stop()));

		logger.info("[Workers]: All workers stopped.");
		process.exit();
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));

	if (env.isDev && import.meta.hot) {
		import.meta.hot.accept();
		import.meta.hot.dispose(async () => {
			try {
				await Promise.allSettled(runningWorkers.map((worker) => worker.stop()));
				logger.info("[Workers]:HMR: Jobs stopped");
			} catch (error) {
				logger.error("[Workers]:HMR: Error stopping jobs", { error });
			}
		});
	}
};
