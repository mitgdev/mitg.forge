import { useMemo } from "react";
import { cn } from "@/sdk/utils/cn";
import { Tooltip } from "@/ui/Tooltip";

type RegionProps = {
	region: "EUROPE" | "NORTH_AMERICA" | "SOUTH_AMERICA" | "OCEANIA";
	className?: string;
};

export const RegionIcon = ({ region, className }: RegionProps) => {
	const worldRegionIcon = useMemo(() => {
		switch (region) {
			case "EUROPE":
				return "/assets/icons/global/option_server_location_eur.png";
			case "NORTH_AMERICA":
				return "/assets/icons/global/option_server_location_usa.png";
			case "SOUTH_AMERICA":
				return "/assets/icons/global/option_server_location_bra.png";
			case "OCEANIA":
				return "/assets/icons/global/option_server_location_all.png";
			default:
				return "/assets/icons/global/option_server_location_all.png";
		}
	}, [region]);

	const regionDescriptions: Record<string, string> = {
		EUROPE: "Servers located in Europe.",
		NORTH_AMERICA: "Servers located in North America.",
		SOUTH_AMERICA: "Servers located in South America.",
		OCEANIA: "Servers located in Oceania.",
	};

	return (
		<Tooltip content={regionDescriptions[region]}>
			<img
				alt="world-region"
				src={worldRegionIcon}
				className={cn("h-12 w-12", className)}
			/>
		</Tooltip>
	);
};
