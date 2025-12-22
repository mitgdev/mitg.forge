import { useQuery } from "@tanstack/react-query";
import { ProductCoinsCard } from "@/components/Products/Coins";
import { useOrderForm } from "@/sdk/contexts/orderform";
import { useOrderFormItem } from "@/sdk/hooks/useOrderFormItem";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";

export const ShopSection = () => {
	const { orderForm } = useOrderForm();
	const { addOrUpdateItem, addOrUpdateLoading } = useOrderFormItem();

	const { data, isPending: productsPending } = useQuery(
		api.query.miforge.shop.products.search.queryOptions({
			input: {
				page: 1,
				size: 100,
			},
		}),
	);

	const products = data?.results ?? [];

	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Shop</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<Container title="Shop" loading={productsPending}>
					<InnerContainer>
						<div
							className={cn(
								"flex flex-row flex-wrap justify-center gap-3 md:justify-start",
							)}
						>
							{products.map((product) => {
								const orderFormItem = orderForm?.items.find(
									(item) => item.productId === product.id,
								);

								if (product.category === "COINS") {
									return (
										<ProductCoinsCard
											key={product.id}
											baseUnitQuantity={product.baseUnitQuantity}
											minUnit={product.minUnits}
											maxUnit={product.maxUnits ?? 1000}
											unitPriceCents={product.unitPriceCents}
											selected={!!orderFormItem}
											initialUnit={orderFormItem?.quantity}
											loading={addOrUpdateLoading || productsPending}
											onSelect={async (quantity, effectiveQuantity) => {
												await addOrUpdateItem({
													productId: product.id,
													quantity: quantity,
													mode: "SET",
													options: {
														toast: {
															successMessage: `${effectiveQuantity} ${product.title} foram adicionados ao carrinho!`,
														},
													},
												});
											}}
										/>
									);
								}

								/**
								 * TODO: Handle other item categories
								 */
								return null;
							})}
						</div>
					</InnerContainer>
					<InnerContainer>
						<div className="flex flex-row flex-wrap items-end justify-end gap-2">
							<ButtonImageLink variant="info" to="/shop/checkout">
								Pagamento
							</ButtonImageLink>
						</div>
					</InnerContainer>
				</Container>
			</InnerSection>
		</Section>
	);
};
