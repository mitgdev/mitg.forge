import { ProductCoinsCard } from "@/components/Products/Coins";
import { useOrderForm } from "@/sdk/contexts/orderform";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";

export function ShopCheckoutItems() {
	const { orderForm } = useOrderForm();

	return (
		<Container title="Cart">
			<InnerContainer>
				{orderForm?.items.map((item) => {
					if (item.category === "COINS") {
						return (
							<ProductCoinsCard
								key={item.id}
								baseUnitQuantity={item.baseUnitQuantity}
								initialUnit={item.quantity}
								maxUnit={item.maxUnits ?? 1000}
								minUnit={item.minUnits}
								unitPriceCents={item.unitPriceCents}
								onSelect={() => null}
								options={{
									showSlider: false,
									showButton: false,
								}}
							/>
						);
					}

					/**
					 * TODO: Handle other item categories
					 */
					return null;
				})}
			</InnerContainer>
		</Container>
	);
}
