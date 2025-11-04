import { env } from "@/infra/env";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
	debug(msg: string, meta?: Record<string, unknown>): void;
	info(msg: string, meta?: Record<string, unknown>): void;
	warn(msg: string, meta?: Record<string, unknown>): void;
	error(msg: string, meta?: Record<string, unknown>): void;
	// cria um logger “filho” com meta base
	with(base: Record<string, unknown>): Logger;
}

type Base = Record<string, unknown>;

class ConsoleTransport {
	constructor(private readonly minLevel: LogLevel = "info") {}
	private order: Record<LogLevel, number> = {
		debug: 10,
		info: 20,
		warn: 30,
		error: 40,
	};

	log(level: LogLevel, payload: Record<string, unknown>) {
		if (this.order[level] < this.order[this.minLevel]) return;
		// JSON estruturado: ótimo pra Loki/ELK/Datadog
		// (se quiser, aplique mask em campos sensíveis aqui)
		const line = JSON.stringify(payload);
		// escolha a stream por nível
		if (level === "error") console.error(line);
		else if (level === "warn") console.warn(line);
		else console.log(line);
	}
}

export class RootLogger implements Logger {
	private transport: ConsoleTransport;
	private base: Base;

	constructor(opts?: { level?: LogLevel; base?: Base }) {
		this.transport = new ConsoleTransport(
			opts?.level ?? env.LOG_LEVEL ?? "info",
		);
		this.base = opts?.base ?? { service: env.SERVICE_NAME };
	}

	private emit(level: LogLevel, msg: string, meta?: Base) {
		const now = new Date();
		this.transport.log(level, {
			level,
			msg,
			time: now.toISOString(),
			...this.base,
			...(meta ?? {}),
		});
	}

	debug(msg: string, meta?: Base) {
		this.emit("debug", msg, meta);
	}
	info(msg: string, meta?: Base) {
		this.emit("info", msg, meta);
	}
	warn(msg: string, meta?: Base) {
		this.emit("warn", msg, meta);
	}
	error(msg: string, meta?: Base) {
		this.emit("error", msg, meta);
	}

	with(base: Base): Logger {
		// cria um logger “filho” com meta combinada
		const child = new RootLogger();
		// biome-ignore lint/suspicious/noExplicitAny: <with>
		(child as any).transport = this.transport;
		// biome-ignore lint/suspicious/noExplicitAny: <with>
		(child as any).base = { ...this.base, ...base };
		return child;
	}
}
