import { useConfig } from "@/sdk/contexts/config";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";

export const NewsSection = () => {
	const { config } = useConfig();

	return (
		<Section>
			<SectionHeader color="green">
				<h2 className="section-title">News</h2>
			</SectionHeader>
			<InnerSection>{JSON.stringify(config, null, 2)}</InnerSection>
		</Section>
	);
};
