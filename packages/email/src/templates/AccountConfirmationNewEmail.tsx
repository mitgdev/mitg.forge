import {
	Body,
	Container,
	Head,
	Html,
	Link,
	Tailwind,
	Text,
} from "@react-email/components";

type AccountConfirmationNewEmailProps = Readonly<{
	link: string;
}>;

export function AccountConfirmationNewEmail({
	link,
}: AccountConfirmationNewEmailProps) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Please confirm your new email address by clicking the link below:
						</Text>
						<Text>
							<Link href={link} className="text-blue-800 underline">
								Confirm Email
							</Link>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: AccountConfirmationNewEmailProps = {
	link: "https://example.com/confirm",
};

export default AccountConfirmationNewEmail;
