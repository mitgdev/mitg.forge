export type Roles =
	| "Admin"
	| "Community Manager"
	| "Game Master"
	| "Senior Tutor"
	| "Tutor"
	| "Player"
	| "Unknown";

export const getPlayerRole = (groupId: number): Roles => {
	switch (groupId) {
		case 6:
			return "Admin";
		case 5:
			return "Community Manager";
		case 4:
			return "Game Master";
		case 3:
			return "Senior Tutor";
		case 2:
			return "Tutor";
		case 1:
			return "Player";
		default:
			return "Unknown";
	}
};
