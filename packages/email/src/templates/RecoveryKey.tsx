import {
	Body,
	Container,
	Head,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";

type RecoveryKeyEmailProps = {
	user: string;
	code: string;
};

export function RecoveryKeyEmail({ user, code }: RecoveryKeyEmailProps) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-10 w-[465px] rounded border border-[#eaeaea] border-solid p-5">
						<Text className="text-[14px] text-black leading-6">
							Hello {user}, your account details were just accessed.
						</Text>
						<Text className="mt-4 text-[14px] text-black leading-6">
							As a security measure, we have generated a new recovery key for
							your account:
						</Text>
						<Text className="mt-4 font-bold text-[16px] text-black leading-6">
							{code}
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: RecoveryKeyEmailProps = {
	user: "John Doe",
	code: "ABCD-EFGH-IJKL-MNOP",
};

export default RecoveryKeyEmail;
