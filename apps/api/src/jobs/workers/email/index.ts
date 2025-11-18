import { renderTemplate } from "@miforge/email";
import { inject, injectable } from "tsyringe";
import type { Mailer, Redis } from "@/domain/clients";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { makeWorker, type WorkerImplementation } from "@/jobs/factory";
import { QueueName } from "@/jobs/types";

@injectable()
export class EmailWorker implements WorkerImplementation<QueueName.Email> {
	private name = QueueName.Email;
	private worker?: ReturnType<typeof makeWorker<QueueName.Email>>;

	constructor(
		@inject(TOKENS.BullConnection) private readonly connection: Redis,
		@inject(TOKENS.Mailer) private readonly mailer: Mailer,
		@inject(TOKENS.Logger) private readonly logger: Logger,
	) {}

	start() {
		if (!env.MAILER_ENABLED) {
			this.logger.info(
				`[Worker:${this.name}]: Mailer is disabled, not starting email worker.`,
			);
			return;
		}

		if (this.worker) return this.worker;

		this.logger.info(`[Worker:${this.name}]: Starting email worker...`);
		this.worker = makeWorker(
			this.name,
			async (job) => {
				const { template, props, subject, to } = job.data;

				const html = await renderTemplate(template, props);

				this.logger.info(
					`[Worker:${this.name}]: Sending email to ${to} with template ${template}`,
				);
				await this.mailer.sendMail({
					to: to,
					subject: subject,
					html: html,
				});
			},
			this.connection,
			this.logger,
		);

		return this.worker;
	}

	stop = async (): Promise<void> => {
		this.logger.info(`[Worker:${this.name}]: Stopping email worker...`);
		await this.worker?.close();
		this.worker = undefined;
	};
}
