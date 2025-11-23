import { useConfig } from "@/sdk/contexts/config";

export const AccountCreateInformation = () => {
	const { config } = useConfig();

	if (!config.account.emailConfirmationRequired) {
		return null;
	}

	return (
		<span className="max-w-lg text-secondary text-sm">
			After creating your account, you will receive an email with a code to
			confirm your email address. Please make sure to check your inbox (and spam
			folder) for this email in order to activate your account.
		</span>
	);
};
