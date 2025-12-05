import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountLostPasswordResetRkForm } from "./form";

export const AccountLostPasswordResetRkSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Lost Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountLostPasswordResetRkForm />
			</InnerSection>
		</Section>
	);
};
