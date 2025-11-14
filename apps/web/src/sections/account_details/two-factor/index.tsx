import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountDetailsTwoFactor = () => {
	return (
		<Container title="Two-Factor Authentication">
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-3">
					<div className="flex flex-col">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							Connect your account to an authenticator app!
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							As a first step to connect an authenticator app to your account,
							click on "Activate"! Then pick up your phone, read the QR code and
							enter the authentication code shown.
						</span>
					</div>
					<div>
						<ButtonImageLink variant="info" to="/">
							Activate
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
