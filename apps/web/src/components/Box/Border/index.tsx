import { assets } from "@/assets";
import { cn } from "@/sdk/utils/cn";

export const BorderBox = ({
	flipped = false,
	golden = false,
}: {
	flipped?: boolean;
	golden?: boolean;
}) => {
	return (
		<img
			src={golden ? "/assets/borders/box-golden.gif" : assets.borders.box}
			alt="border-box"
			className={cn({
				"rotate-180 transform": flipped,
			})}
		/>
	);
};
