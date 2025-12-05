export async function mapWithConcurrency<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let currentIndex = 0;

	async function worker() {
		while (true) {
			const index = currentIndex++;
			if (index >= items.length) {
				break;
			}

			results[index] = await fn(items[index], index);
		}
	}

	const workers = Array.from({ length: concurrency }, () => worker());
	await Promise.all(workers);
	return results;
}
