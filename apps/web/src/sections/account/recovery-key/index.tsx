import { useQuery } from "@tanstack/react-query";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { MessageContainer } from "@/ui/Container/Message";

export const AccountRecoveryKey = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	const isRegistered = !!data?.registration;

	if (isRegistered) {
		return null;
	}

	return (
		<MessageContainer>
			<div className="flex flex-col gap-3 p-2 md:gap-1">
				<div className="flex flex-row flex-wrap items-center justify-between">
					<span className="font-bold text-secondary">
						Your account is not registered!
					</span>
					<ButtonImageLink variant="info" to="/account/registration">
						Register Account
					</ButtonImageLink>
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
