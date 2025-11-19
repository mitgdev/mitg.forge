export const unixTimestampToDate = (
	val: bigint | number | string | null,
): Date | null => {
	if (val === null || val === 0n || val === 0) {
		return null;
	}

	return new Date(Number(val) * 1000);
};

export const dateToUnixTimestamp = (date: Date): number => {
	return Math.floor(date.getTime() / 1000);
};
