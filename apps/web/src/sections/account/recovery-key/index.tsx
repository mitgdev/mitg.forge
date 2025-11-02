import { ButtonLink } from "@/ui/Buttons/ButtonLink";
import { MessageContainer } from "@/ui/Container/Message";

export const AccountRecoveryKey = () => {
	return (
		<MessageContainer>
			<div className="flex flex-col gap-3 p-2 md:gap-1">
				<div className="flex flex-row flex-wrap items-center justify-between">
					<span className="font-bold text-secondary">
						Your account is not registered!
					</span>
					<ButtonLink variant="info" to="/">
						Register Account
					</ButtonLink>
				</div>
				<span className="max-w-lg text-secondary text-sm">
					You can register your account for increased protection. Click on
					"Register Account" and enter your correct address to be able to order
					a new recovery key when needed!
				</span>
			</div>
		</MessageContainer>
	);
};
