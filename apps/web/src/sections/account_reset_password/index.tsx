import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountResetPasswordForm } from "./form";

export const AccountResetPasswordSection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountResetPasswordForm />
			</InnerSection>
		</Section>
	);
};
