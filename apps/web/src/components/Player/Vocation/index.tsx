import { useMemo } from "react";
import type { Vocation } from "@/sdk/types/vocation";
import { Tooltip } from "@/ui/Tooltip";

export const PlayerVocation = ({ vocation }: { vocation: Vocation }) => {
	const mappedVocationsIcon = useMemo(() => {
		if (vocation === "Knight" || vocation === "Elite Knight") {
			return "/assets/vocations/knight.png";
		}

		if (vocation === "Paladin" || vocation === "Royal Paladin") {
			return "/assets/vocations/paladin.png";
		}

		if (vocation === "Sorcerer" || vocation === "Master Sorcerer") {
			return "/assets/vocations/sorcerer.png";
		}

		if (vocation === "Druid" || vocation === "Elder Druid") {
			return "/assets/vocations/druid.png";
		}

		if (vocation === "Monk" || vocation === "Exalted Monk") {
			return "/assets/vocations/monk.png";
		}

		return "/assets/vocations/unknown.gif";
	}, [vocation]);

	return (
		<Tooltip content={vocation}>
			<img alt={`vocation-${vocation}`} src={mappedVocationsIcon} />
		</Tooltip>
	);
};
