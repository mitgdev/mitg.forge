import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { Account2FAUnlinkForm } from "./form";

export const Account2FAUnlinkSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<Account2FAUnlinkForm />
			</InnerSection>
		</Section>
	);
};
