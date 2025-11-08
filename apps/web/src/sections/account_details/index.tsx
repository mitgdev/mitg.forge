import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountDetailsBadges } from "./badges";
import { AccountDetailGeneralInformation } from "./general_information";
import { AccountDetailsHistory } from "./history";
import { AccountDetailsProducts } from "./products";
import { AccountDetailsRegistration } from "./registration";
import { AccountDetailsTwoFactor } from "./two-factor";

export const AccountDetailsSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountDetailGeneralInformation />
				<AccountDetailsBadges />
				<AccountDetailsProducts />
				<AccountDetailsHistory />
				<AccountDetailsRegistration />
				<AccountDetailsTwoFactor />
			</InnerSection>
		</Section>
	);
};
