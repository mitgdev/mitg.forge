import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountConfirmEmailForm } from "./form";

export const AccountConfirmEmailSection = ({ email }: { email: string }) => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountConfirmEmailForm email={email} />
			</InnerSection>
		</Section>
	);
};
