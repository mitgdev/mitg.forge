export function isNonEmpty<T>(arr: T[] | undefined | null): arr is T[] {
	return !!arr && arr.length > 0;
}

export function dedupeArray<T>(
	arr: T[],
	keyFn?: (item: T) => string | number,
): T[] {
	// biome-ignore lint/suspicious/noExplicitAny: <can be anything>
	if (!keyFn) return Array.from(new Set(arr as any)) as T[];

	const seen = new Map<string | number, T>();
	for (const item of arr) {
		seen.set(keyFn(item), item);
	}
	return Array.from(seen.values());
}

export function toArray<T>(v: T | T[]): T[] {
	return Array.isArray(v) ? v : [v];
}

export function normStringArray(v: string | string[]): string[] {
	return [
		...new Set(
			toArray(v)
				.map((s) => String(s).trim())
				.filter(Boolean),
		),
	];
}
