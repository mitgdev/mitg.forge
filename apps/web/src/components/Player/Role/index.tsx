import { useMemo } from "react";
import type { Role } from "@/sdk/types/role";
import { Tooltip } from "@/ui/Tooltip";

export const PlayerRole = ({ role }: { role: Role }) => {
	const mappedRoleIcon = useMemo(() => {
		switch (role) {
			case "Player":
				return "/assets/roles/player.png";
			case "Community Manager":
				return "/assets/roles/community_manager.png";
			case "Game Master":
				return "/assets/roles/game_master.png";
			case "Senior Tutor":
				return "/assets/roles/senior_tutor.png";
			case "Tutor":
				return "/assets/roles/tutor.png";
			case "Admin":
				return "/assets/roles/admin.png";
			default:
				return "/assets/roles/default.png";
		}
	}, [role]);

	return (
		<Tooltip content={role}>
			<img alt={`role-${role}`} src={mappedRoleIcon} className="h-4 w-4" />
		</Tooltip>
	);
};
