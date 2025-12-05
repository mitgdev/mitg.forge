import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountLostForm } from "./form";
import { AccountLostInformation } from "./information";

export const AccountLostSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Lost Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountLostInformation />
				<AccountLostForm />
			</InnerSection>
		</Section>
	);
};
