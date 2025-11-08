const Types = {
	0: "GUEST",
	1: "PLAYER",
	2: "TUTOR",
	3: "SENIOR_TUTOR",
	4: "GAME_MASTER",
	5: "ADMIN",
} as const;

export type AccountType = (typeof Types)[keyof typeof Types];

export const getAccountType = (type: number): AccountType => {
	return Types[type as keyof typeof Types];
};

export const getAccountTypeId = (type: AccountType): number => {
	const entry = Object.entries(Types).find(([, value]) => value === type);
	return entry ? Number(entry[0]) : -1;
};
