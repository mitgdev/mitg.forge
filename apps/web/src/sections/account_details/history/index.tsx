import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountDetailsHistory = () => {
	return (
		<Container title="History">
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							Payments History
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							Contains all historical data of your payments.
						</span>
					</div>
					<div>
						<ButtonImageLink variant="info" to="/">
							View History
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
			<InnerContainer>
				<div className="flex flex-col items-end justify-between gap-1 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col">
						<span className="font-bold font-verdana text-secondary text-sm leading-tight">
							Coins History
						</span>
						<span className="font-verdana text-secondary text-sm leading-tight">
							Contains all historical data about your Tibia Coins and products
							buyable with Tibia Coins.
						</span>
					</div>
					<div>
						<ButtonImageLink variant="info" to="/account/coins_history">
							View History
						</ButtonImageLink>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
};
