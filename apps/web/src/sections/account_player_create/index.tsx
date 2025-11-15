import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountPlayerCreateForm } from "./form";
import { AccountPlayerCreateInformation } from "./information";

export const AccountPlayerCreateSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountPlayerCreateInformation />
				<AccountPlayerCreateForm />
			</InnerSection>
		</Section>
	);
};
