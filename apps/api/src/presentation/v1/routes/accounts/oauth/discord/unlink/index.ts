import { AccountDiscordOauthUnlinkContractSchema } from "@/application/usecases/account/discordUnlink/contract";
import { isAuthenticatedProcedure } from "@/presentation/procedures/isAuthenticated";

export const discordOauthUnlinkRoute = isAuthenticatedProcedure
	.route({
		method: "DELETE",
		path: "/",
		summary: "OAuth Discord Unlink",
		successStatus: 202,
		description: "Unlink the Discord account from the authenticated user.",
	})
	.input(AccountDiscordOauthUnlinkContractSchema.input)
	.output(AccountDiscordOauthUnlinkContractSchema.output)
	.handler(async ({ context }) => {
		return context.usecases.account.discordOauthUnlink.execute();
	});
