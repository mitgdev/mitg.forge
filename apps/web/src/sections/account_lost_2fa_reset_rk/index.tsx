import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountLost2FAResetRkForm } from "./form";

export const AccountLost2FAResetRkSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Lost Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountLost2FAResetRkForm />
			</InnerSection>
		</Section>
	);
};
