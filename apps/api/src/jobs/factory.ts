import {
	type JobsOptions,
	type Processor,
	Queue,
	QueueEvents,
	type QueueOptions,
	Worker,
} from "bullmq";
import type { Redis } from "@/domain/clients";
import type { Logger } from "@/domain/modules";
import type { JobMap, QueueName } from "@/jobs/types";

type Q<N extends QueueName> = Queue<JobMap[N]>;
type W<N extends QueueName> = Worker<JobMap[N]>;
type E = QueueEvents;

const defaultJobs: JobsOptions = {
	attempts: 5,
	backoff: {
		type: "exponential",
		delay: 1000,
	},
	removeOnComplete: 1000,
	removeOnFail: 1000,
};

export type QueueProcessor<N extends QueueName> = Q<N>;

export type QueueImplementation<Q extends QueueName> = {
	name: Q;
	timeoutMs?: number;
	add(job: JobMap[Q]): void;
	addAndWait(job: JobMap[Q], timeoutMs?: number): Promise<unknown>;
};

export function makeQueue<N extends QueueName>(
	name: N,
	connection: Redis,
	opts?: QueueOptions,
	def?: JobsOptions,
): Q<N> {
	return new Queue<JobMap[N]>(name, {
		connection,
		defaultJobOptions: { ...defaultJobs, ...def },
		...opts,
	});
}

export type QueueEventsProcessor = QueueEvents;

export function makeQueueEvents(name: QueueName, connection: Redis): E {
	return new QueueEvents(name, {
		connection,
	});
}

export type WorkerProcessor<N extends QueueName> = W<N>;

export type WorkerImplementation<Q extends QueueName> = {
	start(): WorkerProcessor<Q> | undefined;
	stop: () => Promise<void>;
};

export function makeWorker<N extends QueueName>(
	name: N,
	processor: Processor<JobMap[N]>,
	connection: Redis,
	logger: Logger,
	opts?: Omit<WorkerOptions, "connection">,
): W<N> {
	const worker = new Worker<JobMap[N]>(name, processor, {
		connection,
		concurrency: 5,
		...opts,
	});

	worker.on("completed", (job) => {
		logger.info(`[Worker:${name}] Job completed: ${job.id}`);
	});
	worker.on("failed", (job, err) => {
		logger.error(`[Worker:${name}] Job failed: ${job?.id}`, {
			error: err,
		});
	});

	return worker;
}
