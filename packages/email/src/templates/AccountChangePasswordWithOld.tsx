import {
	Body,
	Container,
	Head,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";

type AccountChangePasswordWithOldProps = Readonly<{}>;

export function AccountChangePasswordWithOld(
	_input: AccountChangePasswordWithOldProps,
) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Hello, your account password has been successfully changed using
							your old password.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: AccountChangePasswordWithOldProps = {};

export default AccountChangePasswordWithOld;
