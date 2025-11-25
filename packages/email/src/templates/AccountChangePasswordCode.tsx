import {
	Body,
	Container,
	Head,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";

type AccountChangePasswordCodeProps = Readonly<{
	token: string;
}>;

export function AccountChangePasswordCode({
	token,
}: AccountChangePasswordCodeProps) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Hello, please use the following token to change your account
							password: <strong>{token}</strong>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: AccountChangePasswordCodeProps = {
	token: "1234567890abcdef",
};

export default AccountChangePasswordCode;
