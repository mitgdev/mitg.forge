import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountLostPasswordResetForm } from "./form";

export const AccountLostPasswordResetSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Lost Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountLostPasswordResetForm />
			</InnerSection>
		</Section>
	);
};
