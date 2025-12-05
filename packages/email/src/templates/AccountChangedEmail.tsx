import {
	Body,
	Container,
	Head,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";

type AccountChangedEmailProps = Readonly<{
	newEmail: string;
}>;

export function AccountChangedEmail({ newEmail }: AccountChangedEmailProps) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Your account email has been changed to {newEmail}. If you did not
							make this change, please contact our support team immediately.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: AccountChangedEmailProps = {
	newEmail: "newemail@example.com",
};

export default AccountChangedEmail;
