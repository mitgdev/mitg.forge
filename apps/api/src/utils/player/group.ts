const Roles = {
	6: "Admin",
	5: "Community Manager",
	4: "Game Master",
	3: "Senior Tutor",
	2: "Tutor",
	1: "Player",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

export const getPlayerRole = (groupId: number): Roles => {
	return Roles[groupId as keyof typeof Roles];
};

export const getPlayerRoleId = (role: Roles): number => {
	const entry = Object.entries(Roles).find(([, value]) => value === role);
	return entry ? Number(entry[0]) : -1;
};
