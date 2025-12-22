import type { ZodType } from "zod";
import { dedupeArray, isNonEmpty } from "@/shared/utils/array";

type FacetKeys<U> = U extends { key: infer K } ? K : never;
type FacetValueOf<U, K> =
	Extract<U, { key: K }> extends { value: infer V } ? V : never;

type ScalarConflictPolicy = "last" | "first" | "error";
type ArrayMergePolicy = "concat" | "union" | "error";
type LimitReaction = "truncate" | "error";

type BuilderLimits<U> = {
	/**
	 * Limite de itens facet recebidos no input (antes do parse).
	 * Ajuda contra payload gigante.
	 */
	maxFacets?: number;

	/**
	 * Limite de valores por key após group/merge.
	 * Ajuda contra OR gigante (ex.: title).
	 */
	maxValuesPerKey?: number;

	/**
	 * Limite de clauses finais no AND/OR.
	 */
	maxClauses?: number;

	/**
	 * Limite por key (sobrescreve maxValuesPerKey).
	 * Ex.: { title: 10 }
	 */
	byKey?: Partial<Record<FacetKeys<U> & string, number>>;
};

type BuilderOptions<U extends { key: string; value: unknown }> = {
	// default: "last"
	scalarConflictPolicy?: ScalarConflictPolicy;

	// default: "concat"
	arrayMergePolicy?: ArrayMergePolicy;

	// quando arrayMergePolicy === "union" e o item não é primitivo, você pode informar como dedupe
	arrayDedupeKey?: (item: unknown) => string | number;

	// default: "AND"
	combineKey?: "AND" | "OR";

	// default: true -> se a mesma key aparecer com array e escalar, explode
	strictValueKind?: boolean;

	// default: "truncate"
	onLimit?: LimitReaction;

	limits?: BuilderLimits<U>;
};

export type FacetHandlersFromUnion<U, Where> = {
	[K in FacetKeys<U> & string]: (
		value: FacetValueOf<U, K>,
	) => Where | Where[] | undefined;
};

type GroupedFacetValues<U extends { key: string; value: unknown }> = Partial<{
	[K in FacetKeys<U> & string]: Array<FacetValueOf<U, K>>;
}>;

export function groupFacetValues<U extends { key: string; value: unknown }>(
	facets: ReadonlyArray<U>,
): GroupedFacetValues<U> {
	const grouped: Partial<Record<string, unknown[]>> = {};

	for (const f of facets) {
		let bucket = grouped[f.key];
		if (bucket === undefined) {
			bucket = [];
			grouped[f.key] = bucket;
		}
		bucket.push(f.value);
	}

	return grouped as GroupedFacetValues<U>;
}

function pushClause<Where>(out: Where[], clause: Where | Where[] | undefined) {
	if (!clause) return;
	if (Array.isArray(clause)) out.push(...clause);
	else out.push(clause);
}

function enforceLimit<T>(
	label: string,
	items: T[],
	max: number | undefined,
	onLimit: LimitReaction,
): T[] {
	if (!max || max <= 0) return items;
	if (items.length <= max) return items;

	if (onLimit === "error") {
		throw new Error(`${label} exceeded limit (${items.length} > ${max})`);
	}

	return items.slice(0, max);
}

const DEFAULT_LIMITS = {
	maxFacets: 30,
	maxValuesPerKey: 10,
	maxClauses: 30,
} as const;

export function makeWhereFromFacets<
	U extends { key: string; value: unknown },
	Where,
>(
	schema: ZodType<U>,
	handlers: FacetHandlersFromUnion<U, Where>,
	options: BuilderOptions<U> = {},
) {
	const {
		arrayMergePolicy = "concat",
		scalarConflictPolicy = "last",
		arrayDedupeKey,
		combineKey = "AND",
		strictValueKind = true,
		onLimit = "truncate",
		limits,
	} = options;

	const mergedLimits: BuilderLimits<U> = {
		...DEFAULT_LIMITS,
		...limits,
		byKey: {
			...(limits?.byKey ?? {}),
		},
	}

	return function whereFromFacets(input: unknown | unknown[]): Where {
		let rawItems = Array.isArray(input) ? input : [input];

		// 1) limite no payload bruto (antes do parse)
		rawItems = enforceLimit("facets", rawItems, mergedLimits.maxFacets, onLimit);

		const valid: U[] = [];
		for (const item of rawItems) {
			const parsed = schema.safeParse(item);
			if (parsed.success) valid.push(parsed.data);
		}

		if (!isNonEmpty(valid)) return {} as Where;

		const grouped = groupFacetValues(valid);
		const clauses: Where[] = [];

		const applyKey = <K extends FacetKeys<U> & string>(
			key: K,
			values: Array<FacetValueOf<U, K>>,
		) => {
			const handler = handlers[key];
			if (!handler || values.length === 0) return;

			const hasArray = values.some(Array.isArray);
			const hasScalar = values.some((v) => !Array.isArray(v));

			if (strictValueKind && hasArray && hasScalar) {
				throw new Error(`Mixed scalar/array facet values for key "${key}"`);
			}

			// limite final por key (pós-merge) — mas pra arrays a gente aplica depois do merge
			const perKeyLimit =
				mergedLimits.byKey?.[key] ?? mergedLimits.maxValuesPerKey;

			if (hasArray) {
				if (arrayMergePolicy === "error" && values.length > 1) {
					throw new Error(`Array conflict detected for facet key "${key}"`);
				}

				const flattened = (values as unknown[][]).flat();
				const merged =
					arrayMergePolicy === "union"
						? dedupeArray(flattened, arrayDedupeKey)
						: flattened;

				const limited = enforceLimit(
					`facet "${key}" values`,
					merged,
					perKeyLimit,
					onLimit,
				);

				pushClause(clauses, handler(limited as FacetValueOf<U, K>));
				return;
			}

			// escalar
			if (values.length > 1 && scalarConflictPolicy === "error") {
				throw new Error(`Scalar conflict detected for facet key "${key}"`);
			}

			// se quiser também limitar quantidade de escalares por key antes da política:
			// (na prática você já resolve conflito com last/first/error)
			const chosen =
				values.length === 1 || scalarConflictPolicy === "last"
					? values[values.length - 1]
					: values[0];

			pushClause(clauses, handler(chosen));
		};

		for (const [key, values] of Object.entries(grouped) as Array<
			[FacetKeys<U> & string, unknown[]]
		>) {
			// biome-ignore lint/suspicious/noExplicitAny: correlation assumption key->value
			applyKey(key as any, values as any);
		}

		if (clauses.length === 0) return {} as Where;

		// 3) limite de clauses finais
		const limitedClauses = enforceLimit(
			`${combineKey} clauses`,
			clauses,
			mergedLimits.maxClauses,
			onLimit,
		);

		return { [combineKey]: limitedClauses } as unknown as Where;
	};
}