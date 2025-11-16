import { useMemo } from "react";
import { Tooltip } from "@/ui/Tooltip";

type PvpTypeProps = {
	description?: string;
	type: "NO_PVP" | "PVP" | "RETRO_PVP" | "PVP_ENFORCED" | "RETRO_HARDCORE";
};

export const PvpTypeIcon = ({ type, description }: PvpTypeProps) => {
	const pvpTypeIcon = useMemo(() => {
		switch (type) {
			case "PVP":
				return "/assets/icons/global/option_server_pvp_type_open.gif";
			case "NO_PVP":
				return "/assets/icons/global/option_server_pvp_type_optional.gif";
			case "PVP_ENFORCED":
				return "/assets/icons/global/option_server_pvp_type_hardcore.gif";
			case "RETRO_PVP":
				return "/assets/icons/global/option_server_pvp_type_retro.gif";
			case "RETRO_HARDCORE":
				return "/assets/icons/global/option_server_pvp_type_retrohardcore.gif";
			default:
				return "/assets/icons/global/option_server_pvp_type_open.gif";
		}
	}, [type]);

	const pvpTypeDescriptions: Record<string, string> = {
		NO_PVP:
			"No PVP: Players can choose to engage in player versus player combat.",
		PVP: "PVP: Player versus player combat is enabled for all players.",
		RETRO_PVP:
			"Retro PVP: A nostalgic PVP experience with classic rules and mechanics.",
		PVP_ENFORCED:
			"PVP Enforced: All players are required to participate in player versus player combat.",
		RETRO_HARDCORE:
			"Retro Hardcore: A challenging PVP mode with permadeath and classic mechanics.",
	};

	return (
		<Tooltip content={description ?? pvpTypeDescriptions[type]}>
			<img
				alt={`world-type-${type}`}
				src={pvpTypeIcon}
				className="h-6 w-6 object-contain"
			/>
		</Tooltip>
	);
};
