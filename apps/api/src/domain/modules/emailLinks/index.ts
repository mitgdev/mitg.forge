import { injectable } from "tsyringe";
import { env } from "@/infra/env";

@injectable()
export class EmailLinks {
	private readonly baseUrl = env.FRONTEND_URL;

	readonly links = {
		accountEmailChangePreview: (token: string) =>
			`${this.baseUrl}/account/email/change/${token}/preview`,
		lostPasswordReset: (token: string) =>
			`${this.baseUrl}/account/lost/password_reset/${token}`,
	};
}
