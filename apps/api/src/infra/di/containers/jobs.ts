import { container, Lifecycle } from "tsyringe";
import { EmailQueue } from "@/jobs/queue/email";
import { EmailWorker } from "@/jobs/workers/email";
import { TOKENS } from "../tokens";

export function registerJobs() {
	// Queues
	container.register(
		TOKENS.EmailQueue,
		{ useClass: EmailQueue },
		{ lifecycle: Lifecycle.Singleton },
	);

	// Workers
	container.register(
		TOKENS.EmailWorker,
		{ useClass: EmailWorker },
		{ lifecycle: Lifecycle.Singleton },
	);
}
