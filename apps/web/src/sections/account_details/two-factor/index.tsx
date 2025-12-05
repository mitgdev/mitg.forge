import { useQuery } from "@tanstack/react-query";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountDetailsTwoFactor = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	const isTwoFactorEnabled = data?.two_factor_enabled ?? false;

	return (
		<Container title="Two-Factor Authentication">
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-3">
					<div className="flex flex-col gap-2">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							{isTwoFactorEnabled ? (
								<>
									Your account is{" "}
									<span className="font-bold text-success">connected</span> to
									an authenticator app.
								</>
							) : (
								<>Connect your account to an authenticator app!</>
							)}
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							{isTwoFactorEnabled && (
								<>
									If you do not want to use an authenticator app any longer, you
									can "Unlink" the authenticator app. Note, however, an
									authenticator app is an important security feature which helps
									to prevent any unauthorized access to your account.
								</>
							)}
							{!isTwoFactorEnabled && (
								<>
									As a first step to connect an authenticator app to your
									account, click on "Activate"! Then pick up your phone, read
									the QR code and enter the authentication code shown.
								</>
							)}
						</span>
					</div>
					<div>
						{isTwoFactorEnabled ? (
							<ButtonImageLink variant="red" to="/account/2fa/unlink">
								Unlink
							</ButtonImageLink>
						) : (
							<ButtonImageLink variant="green" to="/account/2fa/link">
								Link
							</ButtonImageLink>
						)}
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
