import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountPlayerUndeleteForm } from "./form";
import { AccountPlayerUndeleteInformation } from "./information";

export const AccountPlayerUndeleteSection = ({ name }: { name: string }) => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountPlayerUndeleteInformation />
				<AccountPlayerUndeleteForm name={name} />
			</InnerSection>
		</Section>
	);
};
