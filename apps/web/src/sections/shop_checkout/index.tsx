import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { ShopCheckoutItems } from "./items";
import { ShopCheckoutPayments } from "./payments";

export const ShopCheckoutSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Checkout</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<ShopCheckoutItems />
				<ShopCheckoutPayments />
			</InnerSection>
		</Section>
	);
};
