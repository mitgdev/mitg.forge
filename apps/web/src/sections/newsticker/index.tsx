import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { NewstickerItem } from "./item";

const content =
	"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint itaque quidem, quo enim maxime incidunt minus ullam voluptas, quod aliquam est repellendus natus voluptates vero illum ratione non animi corrupti. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint itaque quidem, quo enim maxime incidunt minus ullam voluptas, quod aliquam est repellendus natus voluptates vero illum ratione non animi corrupti.";

export const NewstickerSection = () => {
	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Newsticker</h1>
			</SectionHeader>
			<InnerSection>
				<div className="flex flex-col">
					<NewstickerItem
						icon="community"
						content={content}
						title="Battle Pass"
					/>
					<NewstickerItem
						icon="community"
						content={content}
						title="Battle Pass"
						inverted
					/>
					<NewstickerItem
						icon="community"
						content={content}
						title="Battle Pass"
					/>
					<NewstickerItem
						icon="community"
						content={content}
						title="Battle Pass"
						inverted
					/>
					<NewstickerItem
						icon="community"
						content={content}
						title="Battle Pass"
					/>
				</div>
			</InnerSection>
		</Section>
	);
};
