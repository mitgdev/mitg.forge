import { useMemo } from "react";

type RegionProps = {
	region: "EUROPE" | "NORTH_AMERICA" | "SOUTH_AMERICA" | "OCEANIA";
};

export const RegionIcon = ({ region }: RegionProps) => {
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

	return <img alt="world-region" src={worldRegionIcon} className="h-12 w-12" />;
};
