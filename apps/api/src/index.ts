import "reflect-metadata";
import { config as dotenv } from "dotenv-flow";
import { container } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { appFactory } from "@/infra/config/app";
import { bootstrapContainer } from "@/infra/di/container";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { bootstrapJobs } from "@/jobs/bootstrap";

dotenv({
	node_env: process.env.NODE_ENV || "development",
	debug: true,
});

bootstrapContainer();

const logger = container.resolve<Logger>(TOKENS.RootLogger);

if (import.meta.main) {
	bootstrapJobs();

	const app = appFactory();

	const server = Bun.serve({
		fetch: app.fetch,
		port: env.PORT,
	});

	logger.info(`[Server]: running on port ${env.PORT}`);

	const shutdown = async (signal: string) => {
		logger.info(`Received ${signal}, shutting down server...`);
		server.stop(true);

		await Bun.sleep(500);
		process.exit();
	};

	process.on("SIGINT", () => shutdown("SIGINT"));
	process.on("SIGTERM", () => shutdown("SIGTERM"));

	if (env.isDev && import.meta.hot) {
		import.meta.hot.accept();
		import.meta.hot.dispose(async () => {
			try {
				server.stop(true);
				logger.info("HMR: Server stopped");
			} catch (error) {
				logger.error("HMR: Error stopping server", { error });
			}
		});
	}
}
