/**
 * TODO - Already has a table in the database.
 * Migrate to use that table instead of hardcoding the values.
 */

export const Tows = {
	0: "No Tow",
	1: "Tutorial City",
	5: "AbDendriel",
	6: "Carlin",
	8: "Thais",
	9: "Venore",
	10: "Ankrahmun",
	11: "Edron",
	12: "Farmine",
	13: "Darashia",
	14: "Liberty Bay",
	15: "Port Hope",
	16: "Svargrond",
	17: "Yalahar",
	20: "Rathleton",
} as const;

export type Tow = (typeof Tows)[keyof typeof Tows];

export const getTow = (towId: number): Tow => {
	return Tows[towId as keyof typeof Tows];
};

export const getTowId = (tow: Tow): number => {
	const entry = Object.entries(Tows).find(([, value]) => value === tow);
	return entry ? Number(entry[0]) : -1;
};
