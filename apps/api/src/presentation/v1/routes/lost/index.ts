import { base } from "@/infra/rpc/base";
import { findByEmailOrCharacterNameRoute } from "./findByEmail";
import { generatePasswordResetRoute } from "./generatePasswordReset";
import { resetPasswordWithRecoveryKeyRoute } from "./resetPasswordWithRecoveryKey";
import { resetPasswordWithTokenRoute } from "./resetPasswordWithToken";
import { resetTwoFactorWithRecoveryKeyRoute } from "./resetTwoFactorWithRecoveryKey";
import { validConfirmationTokenRoute } from "./validConfirmationToken";

export const lostAccountRouter = base
	.tag("Lost Account")
	.prefix("/lost")
	.router({
		findByEmail: findByEmailOrCharacterNameRoute,
		generatePasswordReset: generatePasswordResetRoute,
		resetPasswordWithToken: resetPasswordWithTokenRoute,
		resetPasswordWithRecoveryKey: resetPasswordWithRecoveryKeyRoute,
		validConfirmationToken: validConfirmationTokenRoute,
		resetTwoFactorWithRecoveryKey: resetTwoFactorWithRecoveryKeyRoute,
	});
