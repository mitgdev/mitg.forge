import * as net from "node:net";
import { inject, injectable } from "tsyringe";
import { BinaryBuffer, type Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class OtsServerClient {
	private readonly timeout = 5000;

	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {}

	private send(
		packet: BinaryBuffer,
		config: {
			host: string;
			port: number;
		},
	): Promise<BinaryBuffer | null> {
		const raw = packet.getBuffer();
		const header = Buffer.alloc(2);
		header.writeUInt16LE(raw.length, 0);
		const toSend = Buffer.concat([header, raw]);

		return new Promise((resolve) => {
			const socket = net.createConnection(
				{ host: config.host, port: config.port },
				() => {
					// conectado, manda o pacote
					socket.write(toSend);
				},
			);

			let data = Buffer.alloc(0);
			let resolved = false;

			const cleanup = () => {
				socket.removeAllListeners();
				socket.destroy();
			};

			socket.setTimeout(this.timeout, () => {
				if (!resolved) {
					resolved = true;
					cleanup();
					resolve(null);
				}
			});

			socket.on("data", (chunk) => {
				data = Buffer.concat([data, chunk]);
			});

			socket.on("error", (error) => {
				this.logger.error(
					`Error communicating with OTS server at ${config.host}:${config.port} - ${error.message}`,
				);

				if (!resolved) {
					resolved = true;
					cleanup();
					resolve(null); // equivalente ao `false`
				}
			});

			socket.on("end", () => {
				this.logger.info(
					`Connection to OTS server at ${config.host}:${config.port} ended.`,
				);
				if (!resolved) {
					resolved = true;
					cleanup();
					if (data.length === 0) {
						resolve(null);
					} else {
						resolve(new BinaryBuffer(data));
					}
				}
			});

			socket.on("close", () => {
				this.logger.info(
					`Connection to OTS server at ${config.host}:${config.port} closed.`,
				);
				if (!resolved) {
					resolved = true;
					cleanup();
					if (data.length === 0) {
						resolve(null);
					} else {
						resolve(new BinaryBuffer(data));
					}
				}
			});
		});
	}

	async status(config: { host: string; port: number }): Promise<string | null> {
		this.logger.info(
			`Checking OTS server status at ${config.host}:${config.port}`,
		);
		const request = new BinaryBuffer();
		request.putChar(255); // 0xFF
		request.putChar(255); // 0xFF
		request.putString("info", false);

		const response = await this.send(request, config);
		if (!response) {
			return null;
		}

		// XML response
		return response.getBuffer().toString("utf8");
	}
}
