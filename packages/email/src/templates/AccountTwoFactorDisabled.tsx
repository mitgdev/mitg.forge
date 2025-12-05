import {
	Body,
	Container,
	Head,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";

type AccountTwoFactorDisabledProps = Readonly<unknown>;

export function AccountTwoFactorDisabledEmail(
	_input: AccountTwoFactorDisabledProps,
) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Hello, two-factor authentication has been successfully disabled on
							your account. Your account will no longer require a second form of
							verification when logging in. If you did not initiate this change,
							please contact our support team immediately to ensure the security
							of your account.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: AccountTwoFactorDisabledProps = {};

export default AccountTwoFactorDisabledEmail;
