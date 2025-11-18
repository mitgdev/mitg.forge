const Samples = {
	0: "Rook Sample",
	1: "Sorcerer Sample",
	2: "Druid Sample",
	3: "Paladin Sample",
	4: "Knight Sample",
	9: "Monk Sample",
} as const;

export type Sample = (typeof Samples)[keyof typeof Samples];

export const getSampleName = (sampleId: number): Sample => {
	return Samples[sampleId as keyof typeof Samples];
};

export const getSampleId = (sample: Sample): number => {
	const entry = Object.entries(Samples).find(([, value]) => value === sample);
	return entry ? Number(entry[0]) : -1;
};
