import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { ShopDonateForm } from "./form";

export const ShopDonateSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Shop</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<ShopDonateForm />
			</InnerSection>
		</Section>
	);
};
