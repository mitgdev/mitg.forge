import { container } from "tsyringe";
import type { Logger } from "@/domain/modules/logging/logger";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { EmailWorker } from "./workers/email.worker";

export const bootstrapJobs = () => {
	const logger = container.resolve<Logger>(TOKENS.RootLogger);
	const workers: { stop: () => Promise<void> }[] = [];

	const emailWorker = container.resolve<EmailWorker>(TOKENS.EmailWorker);
	emailWorker.start();
	workers.push({
		stop: () => emailWorker.stop(),
	});

	const shutdown = async (signal: string) => {
		logger.info(`Received ${signal}, shutting down jobs...`);

		await Promise.allSettled(workers.map((worker) => worker.stop()));

		logger.info("All jobs stopped.");
		process.exit();
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));

	if (env.isDev && import.meta.hot) {
		import.meta.hot.accept();
		import.meta.hot.dispose(async () => {
			try {
				await Promise.allSettled(workers.map((worker) => worker.stop()));
				logger.info("HMR: Jobs stopped");
			} catch (error) {
				logger.error("HMR: Error stopping jobs", { error });
			}
		});
	}
};
