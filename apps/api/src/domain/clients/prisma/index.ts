import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "generated/client";
import type { Logger } from "@/domain/modules";
import { env } from "@/infra/env";

export type Prisma = PrismaClient;

export function makePrisma(rootLogger?: Logger) {
	const adapter = new PrismaMariaDb({
		host: env.DATABASE_HOST,
		user: env.DATABASE_USER,
		password: env.DATABASE_PASSWORD,
		database: env.DATABASE_NAME,
		connectionLimit: 10,
		acquireTimeout: 10000,
		idleTimeout: 60000,
	});
	const prisma = new PrismaClient({
		adapter,
		log: [
			{ level: "query", emit: "event" },
			{ level: "error", emit: "event" },
			{ level: "warn", emit: "event" },
		],
	});

	if (rootLogger) {
		prisma.$on("query", (event) => {
			rootLogger.debug("prisma.query", event);
		});
		prisma.$on("warn", (event) => rootLogger.warn("prisma.warn", event));
		prisma.$on("error", (event) => rootLogger.error("prisma.error", event));
	}

	const shutdown = async () => {
		try {
			await prisma.$disconnect();
		} catch {}
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);

	return prisma;
}
