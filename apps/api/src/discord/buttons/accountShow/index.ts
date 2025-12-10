import { type ButtonInteraction, MessageFlags } from "discord.js";
import { inject, injectable } from "tsyringe";
import z from "zod";
import { DiscordButtonHandlerBase } from "@/discord/buttons/base";
import { BUTTON_ID_PREFIX } from "@/discord/buttons/custom-ids";
import { DiscordError, DiscordErrorCode } from "@/discord/utils/error";
import type { ExecutionContext } from "@/domain/context";
import type { AccountRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";

const AccountShowPayloadSchema = z.unknown();

type AccountShowPayload = z.infer<typeof AccountShowPayloadSchema>;

@injectable()
export class DiscordAccountShowButtonHandler extends DiscordButtonHandlerBase<AccountShowPayload> {
	prefix = BUTTON_ID_PREFIX.ACCOUNT_SHOW;
	schema = AccountShowPayloadSchema;

	public middlewares = [TOKENS.DiscordRequireLinkedAccountMiddleware];

	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
	) {
		super();
	}

	async handle(
		interaction: ButtonInteraction,
		_payload: AccountShowPayload,
		ctx: ExecutionContext,
	): Promise<void> {
		const session = ctx.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new DiscordError(DiscordErrorCode.AccountNotFound, {
				message: `Account with email ${session.email} not found`,
				userMessage:
					"Conta não encontrada. Por favor, verifique se sua conta está corretamente vinculada.",
			});
		}

		await interaction.reply({
			content: [
				"✅ Conta encontrada",
				`Email: \`${session.email}\``,
				`Criada em: \`${account.created_at.toISOString()}\``,
			].join("\n"),
			flags: MessageFlags.Ephemeral,
		});
	}
}
