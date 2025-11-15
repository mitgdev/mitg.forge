import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountCoinsHistory } from "./coin_history";
import { AccountCoinsBalance } from "./coins_balance";

export const AccountCoinsHistorySection = () => {
	return (
		<Section>
			<SectionHeader color="green" backButton>
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<AccountCoinsBalance />
				<AccountCoinsHistory />
			</InnerSection>
		</Section>
	);
};
