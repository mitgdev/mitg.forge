import { useQuery } from "@tanstack/react-query";
import { api } from "@/sdk/lib/api/factory";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Tooltip } from "@/ui/Tooltip";

export const AccountDetailsProducts = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	if (!data) {
		return null;
	}

	return (
		<Container title="Products Available">
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col">
						<div className="flex flex-row items-center gap-1">
							<span className="font-bold font-verdana text-secondary text-sm leading-tight">
								Tibia Coins
							</span>
							<Tooltip content="Information about Tibia Coins">
								<img alt="coins info" src="/assets/icons/global/info.gif" />
							</Tooltip>
						</div>
						<span className="font-verdana text-secondary text-sm leading-tight">
							Get Tibia Coins to shop exclusive products in the Store, including
							Mounts, Outfits, a Character Name Change or even Premium Time.
						</span>
					</div>
					<div>
						<ButtonImageLink variant="green" to="/">
							Get Tibia Coins
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							Extra Services
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							Order a Recovery Key if you need a new one.
						</span>
					</div>
					<div>
						<ButtonImageLink variant="green" to="/">
							Buy Recovery Key
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							Use Game Code
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							Enter your game code for Premium Time, Tibia Coins or an Extra
							Service.
						</span>
					</div>
					<div>
						<ButtonImageLink variant="info" to="/">
							Use Game Code
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
