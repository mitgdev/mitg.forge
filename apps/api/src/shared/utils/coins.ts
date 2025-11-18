const Coins = {
	0: "non-transferable",
	1: "transferable",
} as const;

export type Coins = (typeof Coins)[keyof typeof Coins];

export const getCoinType = (coinTypeId: number): Coins => {
	return Coins[coinTypeId as keyof typeof Coins] || "unknown";
};

export const getCoinTypeId = (coinType: Coins): number => {
	const entry = Object.entries(Coins).find(([, value]) => value === coinType);
	return entry ? Number(entry[0]) : -1;
};
