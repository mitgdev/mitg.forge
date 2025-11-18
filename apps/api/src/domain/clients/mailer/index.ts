import nodemailer, { type Transporter } from "nodemailer";
import { inject, injectable } from "tsyringe";
import type { Logger } from "@/domain/modules";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";

type MailerConfigSMTP = {
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
};

type MailerConfigGoogleOauth2 = {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	user: string;
};

type MailerLoaderConfig = {
	enabled: boolean;
	config: MailerConfigSMTP | MailerConfigGoogleOauth2 | null;
};

function loadingMailerConfig(): MailerLoaderConfig {
	if (!env.MAILER_ENABLED) {
		return {
			enabled: false,
			config: null,
		};
	}

	if (env.MAILER_SMTP_HOST && env.MAILER_SMTP_PORT) {
		return {
			enabled: true,
			config: {
				host: env.MAILER_SMTP_HOST,
				port: env.MAILER_SMTP_PORT,
				secure: env.MAILER_SMTP_SECURE,
				user: env.MAILER_SMTP_USER,
				pass: env.MAILER_SMTP_PASS,
			},
		};
	}

	if (
		env.MAILER_GOOGLE_CLIENT_ID &&
		env.MAILER_GOOGLE_CLIENT_SECRET &&
		env.MAILER_GOOGLE_REFRESH_TOKEN
	) {
		return {
			enabled: true,
			config: {
				clientId: env.MAILER_GOOGLE_CLIENT_ID,
				clientSecret: env.MAILER_GOOGLE_CLIENT_SECRET,
				refreshToken: env.MAILER_GOOGLE_REFRESH_TOKEN,
				user: env.MAILER_GOOGLE_USER,
			},
		};
	}

	return {
		enabled: false,
		config: null,
	};
}

@injectable()
export class Mailer {
	private transport!: Transporter;
	private mode: "SMTP" | "GoogleOAuth2" | "Noop" = "Noop";

	constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {
		const { config, enabled } = loadingMailerConfig();

		if (!enabled || !config) {
			this.mode = "Noop";
			this.transport = nodemailer.createTransport({
				jsonTransport: true,
				name: "NoopMailer",
			});
		}

		if (config instanceof Object && "host" in config) {
			this.mode = "SMTP";
			this.transport = nodemailer.createTransport({
				host: config.host,
				port: config.port,
				secure: config.secure,
				pool: true, // ♻️  enable connection pooling
				maxConnections: 5, // optional – defaults to 5
				maxMessages: 100, // optional – defaults to 100
				auth: {
					user: config.user,
					pass: config.pass,
				},
			});
		}

		if (config instanceof Object && "clientId" in config) {
			this.mode = "GoogleOAuth2";
			this.transport = nodemailer.createTransport({
				service: "gmail",
				auth: {
					type: "OAuth2",
					user: config.user,
					clientId: config.clientId,
					clientSecret: config.clientSecret,
					refreshToken: config.refreshToken,
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
