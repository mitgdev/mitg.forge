export const unixTimestampToDate = (val: bigint | number | string): Date => {
	return new Date(Number(val) * 1000);
};

export const dateToUnixTimestamp = (date: Date): number => {
	return Math.floor(date.getTime() / 1000);
};
