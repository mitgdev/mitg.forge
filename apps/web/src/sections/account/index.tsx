import { useQuery } from "@tanstack/react-query";
import { HeadlineBracerTitle } from "@/components/Titles/HeadlineBracer";
import { api } from "@/sdk/lib/api/factory";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { AccountCharacters } from "./characters";
import { AccountDownload } from "./download";
import { AccountRecoveryKey } from "./recovery-key";
import { AccountStatus } from "./status";

export type AccountSectionDetails = Awaited<
	ReturnType<typeof api.client.miforge.accounts.details>
>;

export const AccountSection = () => {
	const { data } = useQuery(api.query.miforge.accounts.details.queryOptions());

	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Account Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<HeadlineBracerTitle title="Welcome to your account!" />
				<AccountStatus
					premium={(data?.premdays ?? 0) > 0}
					premiumDays={data?.premdays}
					premiumExpiresAt={data?.lastday}
				/>
				<AccountDownload />
				<AccountRecoveryKey />
				<AccountCharacters characters={data?.characters ?? []} />
			</InnerSection>
		</Section>
	);
};
