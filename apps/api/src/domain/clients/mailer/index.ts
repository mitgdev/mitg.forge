import nodemailer, { type Transporter } from "nodemailer";
import { inject, injectable } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

@injectable()
export class Mailer {
	private transport!: Transporter;
	private mode: "SMTP" | "GoogleOAuth2" | "Noop" = "Noop";

	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {
		const enabled = Boolean(env.MAILER_PROVIDER);

		if (!enabled) {
			this.mode = "Noop";
			this.transport = nodemailer.createTransport({
				jsonTransport: true,
				name: "NoopMailer",
			});
		}

		if (env.MAILER_PROVIDER === "SMTP") {
			this.mode = "SMTP";
			this.transport = nodemailer.createTransport({
				host: env.MAILER_SMTP_HOST,
				port: env.MAILER_SMTP_PORT,
				secure: env.MAILER_SMTP_SECURE,
				pool: true, // ♻️  enable connection pooling
				maxConnections: 5, // optional – defaults to 5
				maxMessages: 100, // optional – defaults to 100
				auth: {
					user: env.MAILER_SMTP_USER,
					pass: env.MAILER_SMTP_PASS,
				},
			});
		}

		if (env.MAILER_PROVIDER === "GOOGLE") {
			this.mode = "GoogleOAuth2";
			this.transport = nodemailer.createTransport({
				service: "gmail",
				auth: {
					type: "OAuth2",
					user: env.MAILER_GOOGLE_USER,
					clientId: env.MAILER_GOOGLE_CLIENT_ID,
					clientSecret: env.MAILER_GOOGLE_CLIENT_SECRET,
					refreshToken: env.MAILER_GOOGLE_REFRESH_TOKEN,
				},
			});
		}

		this.transport.on("error", (error) => {
			this.logger.error("[Mailer] Email transport error", {
				error: error,
			});
		});
	}

	async sendMail(
		options: Omit<nodemailer.SendMailOptions, "from">,
	): Promise<string> {
		this.logger.info(`[Mailer] Sending email using ${this.mode} mode`, {
			to: options.to,
			subject: options.subject,
		});
		const info = await this.transport.sendMail({
			from: `"${env.MAILER_FROM_NAME}" <${env.MAILER_SMTP_USER}>`,
			...options,
		});

		return info?.messageId as string;
	}
}
