import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountLostChangeEmailRkForm } from "./form";

export const AccountLostChangeEmailRkSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Lost Account</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountLostChangeEmailRkForm />
			</InnerSection>
		</Section>
	);
};
