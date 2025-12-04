import {
	Body,
	Container,
	Head,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";

type AccountTwoFactorEnabledProps = Readonly<unknown>;

export function AccountTwoFactorEnabledEmail(
	_input: AccountTwoFactorEnabledProps,
) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Hello, two-factor authentication has been successfully enabled on
							your account. From now on, you will need to provide a second form
							of verification when logging in to enhance the security of your
							account.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: AccountTwoFactorEnabledProps = {};

export default AccountTwoFactorEnabledEmail;
