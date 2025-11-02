type Vocation =
	| "No Vocation"
	| "Sorcerer"
	| "Druid"
	| "Paladin"
	| "Knight"
	| "Master Sorcerer"
	| "Elder Druid"
	| "Royal Paladin"
	| "Elite Knight"
	| "Monk"
	| "Exalted Monk"
	| "Unknown Vocation";

export const getVocationName = (vocationId: number): Vocation => {
	switch (vocationId) {
		case 0:
			return "No Vocation";
		case 1:
			return "Sorcerer";
		case 2:
			return "Druid";
		case 3:
			return "Paladin";
		case 4:
			return "Knight";
		case 5:
			return "Master Sorcerer";
		case 6:
			return "Elder Druid";
		case 7:
			return "Royal Paladin";
		case 8:
			return "Elite Knight";
		case 9:
			return "Monk";
		case 10:
			return "Exalted Monk";
		default:
			return "Unknown Vocation";
	}
};
