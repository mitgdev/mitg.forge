import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountPlayerEditForm } from "./form";
import { AccountPlayerEditInformation } from "./information";

export const AccountPlayerEditSection = ({ name }: { name: string }) => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountPlayerEditInformation />
				<AccountPlayerEditForm name={name} />
			</InnerSection>
		</Section>
	);
};
