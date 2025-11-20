import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountPlayerDeleteForm } from "./form";
import { AccountPlayerDeleteInformation } from "./information";

export const AccountPlayerDeleteSection = ({ name }: { name: string }) => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountPlayerDeleteInformation />
				<AccountPlayerDeleteForm name={name} />
			</InnerSection>
		</Section>
	);
};
