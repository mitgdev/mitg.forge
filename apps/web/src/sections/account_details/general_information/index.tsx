import { useQuery } from "@tanstack/react-query";
import { List } from "@/components/List";
import { useConfig } from "@/sdk/contexts/config";
import { useTimezone } from "@/sdk/hooks/useTimezone";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Tooltip } from "@/ui/Tooltip";

export const AccountDetailGeneralInformation = () => {
	const { config } = useConfig();
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());
	const { formatDate } = useTimezone();

	if (!data) {
		return null;
	}

	const confirmationIsRequired = config.account.emailConfirmationRequired;
	const hasConfirmedEmail = data?.email_confirmed;
	const isPremium = data?.premdays > 0;

	return (
		<Container title="General Information">
			<InnerContainer className="p-0">
				<List zebra labelCol="180px" className="leading-tight">
					<List.Item title="Email Address">
						<span className="font-verdana text-secondary text-sm">
							{data?.email}
						</span>
					</List.Item>
					{confirmationIsRequired && (
						<List.Item title="Email Status">
							<span
								className={cn("font-bold font-verdana text-sm", {
									"text-success": hasConfirmedEmail,
									"text-error": !hasConfirmedEmail,
								})}
							>
								{hasConfirmedEmail ? "Confirmed" : "Unconfirmed"}
							</span>
						</List.Item>
					)}
					<List.Item title="Created">
						<span className="font-verdana text-secondary text-sm">
							{formatDate(data?.creation ?? new Date())}
						</span>
					</List.Item>
					<List.Item title="Account Status">
						<span
							className={cn("font-bold font-verdana text-sm", {
								"text-success": isPremium,
								"text-error": !isPremium,
							})}
						>
							{isPremium ? "Premium Account" : "Free Account"}
						</span>
					</List.Item>

					<List.Item title="Tibia Coins">
						<div className="flex flex-row flex-wrap items-center gap-2">
							<div className="flex flex-row items-center gap-0.5">
								<span className="font-verdana text-secondary text-sm">
									{data.coins}
								</span>
								<Tooltip content="Non-transferable coins">
									<img
										alt="tibia coins"
										src="/assets/icons/global/icon-tibiacoin.png"
										className="h-3 w-3"
										width={12}
										height={12}
									/>
								</Tooltip>
							</div>
							<div className="flex flex-row items-center gap-0.5 font-verdana text-secondary text-sm">
								({data.coins_transferable})
								<Tooltip content="Transferable coins">
									<img
										alt="tibia coins"
										className="h-3 w-3 min-w-3"
										src="/assets/icons/global/icon-tibiacointrusted.png"
										width={12}
										height={12}
									/>
								</Tooltip>
							</div>
							<Tooltip content="Transferable coins can be used in the Tibia Store and traded with other players.">
								<img alt="coins info" src="/assets/icons/global/info.gif" />
							</Tooltip>
						</div>
					</List.Item>
					<List.Item title="Tournament Coins">
						<div className="flex flex-row flex-wrap items-center gap-2">
							<div className="flex flex-row items-center gap-0.5">
								<span className="font-verdana text-secondary text-sm">
									{data.tournament_coins}
								</span>
								<Tooltip content="Tournament coins">
									<img
										alt="tibia coins"
										src="/assets/icons/global/icon-tournamentcoin.png"
										width={12}
										height={12}
									/>
								</Tooltip>
							</div>
						</div>
					</List.Item>
					<List.Item title="Loyalty Points">
						<span className="font-verdana text-secondary text-sm">0</span>
					</List.Item>
					<List.Item title="Loyalty Title">
						<span className="font-verdana text-secondary text-sm">
							Scout of Tibia (Promotion to: Sentinel of Tibia at 1 Loyalty
							Points)
						</span>
					</List.Item>
				</List>
			</InnerContainer>
			<div className="flex flex-row flex-wrap justify-end gap-1">
				<ButtonImageLink variant="red" to="/">
					Terminate Account
				</ButtonImageLink>
				<ButtonImageLink variant="info" to="/account/reset_password">
					Change Password
				</ButtonImageLink>
				<ButtonImageLink variant="info" to="/">
					Change Email
				</ButtonImageLink>
			</div>
		</Container>
	);
};
