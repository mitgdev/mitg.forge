export const Vocations = {
	0: "No Vocation",
	1: "Sorcerer",
	2: "Druid",
	3: "Paladin",
	4: "Knight",
	5: "Master Sorcerer",
	6: "Elder Druid",
	7: "Royal Paladin",
	8: "Elite Knight",
	9: "Monk",
	10: "Exalted Monk",
} as const;

export type Vocation = (typeof Vocations)[keyof typeof Vocations];

export const getVocationName = (vocationId: number): Vocation => {
	return Vocations[vocationId as keyof typeof Vocations];
};

export const getVocationId = (vocation: Vocation): number => {
	const entry = Object.entries(Vocations).find(
		([, value]) => value === vocation,
	);
	return entry ? Number(entry[0]) : -1;
};
