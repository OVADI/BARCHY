import type { Fact } from '$lib/schema/fact';

/** Value of an exact condition, e.g. n = 3 or l = 5 m. */
export function conditionValue(fact: Fact, symbol: string): number | undefined {
	const c = fact.when?.find((w) => w.symbol === symbol && w.bound === 'exact');
	return typeof c?.value === 'number' ? c.value : undefined;
}

export interface MasonryTable {
	/** Number of storeys n, ascending (rows). */
	storeys: number[];
	/** Bay width l in m with the floor thickness h_t in mm that belongs to it (columns). */
	spans: { l: number; ht: number }[];
	/** The fact at n storeys and bay width l. */
	cell: (n: number, l: number) => Fact | undefined;
}

/** Rebuilds the source table (storeys × bay width) from one group's facts and their conditions. */
export function masonryTable(facts: Fact[]): MasonryTable {
	const storeys = [...new Set(facts.map((f) => conditionValue(f, 'n')!))].sort((a, b) => a - b);
	const spans = [
		...new Map(
			facts.map((f) => [conditionValue(f, 'l')!, conditionValue(f, 'h_t')!] as const)
		).entries()
	]
		.map(([l, ht]) => ({ l, ht }))
		.sort((a, b) => a.l - b.l);
	const cell = (n: number, l: number) =>
		facts.find((f) => conditionValue(f, 'n') === n && conditionValue(f, 'l') === l);
	return { storeys, spans, cell };
}
