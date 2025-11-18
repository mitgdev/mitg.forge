import type { TemplateName } from "@miforge/email";
import { inject, injectable } from "tsyringe";
import type { Redis } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import {
	makeQueue,
	makeQueueEvents,
	type QueueImplementation,
} from "@/jobs/factory";
import { type EmailJob, QueueName } from "@/jobs/types";

@injectable()
export class EmailQueue implements QueueImplementation<QueueName.Email> {
	public readonly name = QueueName.Email;
	public readonly timeoutMs = 30_000;
	private readonly queue: ReturnType<typeof makeQueue<QueueName.Email>>;
	private readonly events: ReturnType<typeof makeQueueEvents>;

	constructor(@inject(TOKENS.BullConnection) private connection: Redis) {
		this.queue = makeQueue(QueueName.Email, this.connection);
		this.events = makeQueueEvents(QueueName.Email, this.connection);
	}

	private makeJobId<T extends TemplateName>(job: EmailJob<T>) {
		return job.idempotencyKey ?? `email:${job.to}:${job.subject}`;
	}

	add<T extends TemplateName>(job: EmailJob<T>): void {
		const jobId = this.makeJobId(job);
		this.queue.add(jobId, job);
		return;
	}

	async addAndWait<T extends TemplateName>(
		job: EmailJob<T>,
		timeoutMs = this.timeoutMs,
	) {
		const jobId = this.makeJobId(job);

		const j = await this.queue.add(jobId, job);

		const result = await j.waitUntilFinished(this.events, timeoutMs);
		return result;
	}
}
