import { useQuery } from "@tanstack/react-query";
import { TibiaCoins } from "@/components/Coins";
import { List } from "@/components/List";
import { api } from "@/sdk/lib/api/factory";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export const AccountCoinsBalance = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	/**
	 * TODO: For now coins_reserved is not available in the API.
	 * This functionality will be added once the bazar is implemented.
	 */
	return (
		<Container title="General Information">
			<InnerContainer className="p-0">
				<List zebra labelCol="180px" className="leading-tight">
					<List.Item title="Tibia Coins">
						<TibiaCoins type="non-transferable" amount={data?.coins ?? 0} />
					</List.Item>
					<List.Item title="Transferable Coins">
						<TibiaCoins
							type="transferable"
							amount={data?.coins_transferable ?? 0}
						/>
					</List.Item>
					<List.Item title="Reserved Coins">
						<TibiaCoins type="reserved" amount={0} />
					</List.Item>
				</List>
			</InnerContainer>
		</Container>
	);
};
