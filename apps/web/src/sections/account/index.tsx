import { HeadlineBracerTitle } from "@/components/Titles/HeadlineBracer";

import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountCharacters } from "./characters";
import { AccountDownload } from "./download";
import { AccountRecoveryKey } from "./recovery-key";
import { AccountStatus } from "./status";

export const AccountSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<HeadlineBracerTitle title="Welcome to your account!" />
				<AccountStatus />
				<AccountDownload />
				<AccountRecoveryKey />
				<AccountCharacters />
			</InnerSection>
		</Section>
	);
};
