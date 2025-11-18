const Gender = {
	0: "Female",
	1: "Male",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const getPlayerGender = (genderId: number): Gender => {
	return Gender[genderId as keyof typeof Gender];
};

export const getPlayerGenderId = (gender: Gender): number => {
	const entry = Object.entries(Gender).find(([, value]) => value === gender);
	return entry ? Number(entry[0]) : -1;
};
