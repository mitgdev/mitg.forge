import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountLostOptionsForm } from "./form";
import { AccountLostOptionsInfo } from "./info";

export const AccountLostOptionsSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Lost Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountLostOptionsInfo />
				<AccountLostOptionsForm />
			</InnerSection>
		</Section>
	);
};
