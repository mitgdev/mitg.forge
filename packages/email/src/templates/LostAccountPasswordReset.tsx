import {
	Body,
	Container,
	Head,
	Html,
	Link,
	Tailwind,
	Text,
} from "@react-email/components";

type LostAccountPasswordResetProps = Readonly<{
	link: string;
}>;

export function LostAccountPasswordResetEmail(
	input: LostAccountPasswordResetProps,
) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Hello, to reset your account password, please click the link
							below:
						</Text>
						<Text>
							<Link href={input.link} className="text-blue-800 underline">
								Reset my password
							</Link>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: LostAccountPasswordResetProps = {
	link: "https://example.com/reset-password?token=abcd1234",
};

export default LostAccountPasswordResetEmail;
