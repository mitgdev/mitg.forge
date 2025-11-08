import { useQuery } from "@tanstack/react-query";
import { List } from "@/components/List";
import { useTimezone } from "@/sdk/hooks/useTimezone";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { ButtonLink } from "@/ui/Buttons/ButtonLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Tooltip } from "@/ui/Tooltip";

export const AccountDetailGeneralInformation = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());
	const { formatDate } = useTimezone();

	if (!data) {
		return null;
	}

	const isPremium = data?.premdays > 0;

	return (
		<Container title="General Information">
			<InnerContainer className="p-0">
				<List zebra labelCol="150px" className="leading-tight">
					<List.Item title="Email Address">
						<span className="font-verdana text-secondary text-sm">
							{data?.email}
						</span>
					</List.Item>
					<List.Item title="Created">
						<span className="font-verdana text-secondary text-sm">
							{formatDate(data.creation)}
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
									{data.coins_transferable}
								</span>
								<Tooltip content="Transferable coins">
									<img
										alt="tibia coins"
										src="/assets/icons/global/icon-tibiacoin.png"
										width={12}
										height={12}
									/>
								</Tooltip>
							</div>
							<div className="flex flex-row items-center gap-0.5 font-verdana text-secondary text-sm">
								(Including: {data.coins}{" "}
								<Tooltip content="Non-transferable coins">
									<img
										alt="tibia coins"
										src="/assets/icons/global/icon-tibiacointrusted.png"
										width={12}
										height={12}
									/>
								</Tooltip>
								)
							</div>
							<Tooltip content="Transferable coins can be used in the Tibia Store and traded with other players.">
								<img alt="coins info" src="/assets/icons/global/info.gif" />
							</Tooltip>
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
				<ButtonLink variant="red" to="/">
					Terminate Account
				</ButtonLink>
				<ButtonLink variant="info" to="/">
					Change Password
				</ButtonLink>
				<ButtonLink variant="info" to="/">
					Change Email
				</ButtonLink>
			</div>
		</Container>
	);
};
