import { type PropsOf, renderEmail } from "@miforge/emails";
import { inject, injectable } from "tsyringe";
import type { Mailer } from "@/domain/modules/clients";
import { TOKENS } from "@/infra/di/tokens";

@injectable()
export class MailerRepository {
	constructor(@inject(TOKENS.Mailer) private readonly mailer: Mailer) {}

	async recoveryKey(props: PropsOf<"RecoveryKey">): Promise<void> {
		const html = await renderEmail("RecoveryKey", props);

		/**
		 * TODO: Replace with real email by props
		 */
		this.mailer.sendMail({
			to: "mailtemp@example.com",
			subject: "Account details accessed",
			html,
		});
	}
}
