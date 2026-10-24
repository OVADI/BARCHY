import { compact, normalize } from './normalize';
import { SEARCH_KINDS, type SearchEntry, type SearchIndex } from './types';

/**
 * Score of one entry, 0 when it does not match.
 * A whole name beats the start of a name, which beats every word found, which beats loose text.
 */
function score(entry: SearchEntry, shared: string, query: string, tokens: string[]): number {
	const q = compact(query);
	if (entry.names.includes(q)) return 100;
	if (entry.names.some((n) => n.startsWith(q))) return 80;

	const words = `${entry.names.join(' ')} ${entry.text ?? ''} ${shared}`.split(' ');
	// Whole words first: "beton" finds concrete before "betonsteen".
	if (tokens.every((t) => words.includes(t))) return 65;
	if (tokens.every((t) => words.some((w) => w.startsWith(t)))) return 60;
	const all = words.join(' ');
	if (tokens.every((t) => all.includes(t))) return 30;
	return 0;
}

const KIND_ORDER = new Map(SEARCH_KINDS.map((k, i) => [k, i]));

/** Matching entries, best first; ties keep kind order, then index order (steel sizes ascending). */
export function search(index: SearchIndex, query: string): SearchEntry[] {
	const q = normalize(query);
	if (!q) return [];
	const tokens = q.split(' ');
	return index.entries
		.map((entry, i) => ({
			entry,
			i,
			s: score(entry, entry.group ? (index.shared[entry.group] ?? '') : '', q, tokens)
		}))
		.filter((x) => x.s > 0)
		.sort(
			(a, b) =>
				b.s - a.s || KIND_ORDER.get(a.entry.kind)! - KIND_ORDER.get(b.entry.kind)! || a.i - b.i
		)
		.map((x) => x.entry);
}
