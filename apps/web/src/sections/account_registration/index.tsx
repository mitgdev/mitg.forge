import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountRegistrationForm } from "./form";
import { AccountRegistrationInformation } from "./information";

export const AccountRegistrationSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Registration</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountRegistrationInformation />
				<AccountRegistrationForm />
			</InnerSection>
		</Section>
	);
};
