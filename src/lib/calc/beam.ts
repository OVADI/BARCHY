import type { Condition, Fact } from '../schema/fact';

/**
 * Beam estimator: from a span l and a rule of thumb (h = l/n, a = 0,25 · l, …) to sizes.
 * Pure functions; spans in m, results in m. The rules come from content/facts, so a corrected
 * fact changes the estimate.
 */

export type BeamMaterial = 'steel' | 'timber' | 'concrete';

/** Groups whose rules give sizes from a span; L in the concrete floor tables is the span too. */
export const BEAM_GROUPS: Record<BeamMaterial, string[]> = {
	steel: ['beams-floor', 'beams-roof', 'purlins'],
	timber: [
		'beams-straight',
		'beams-cantilever',
		'beams-continuous',
		'beams-pitched',
		'beams-curved',
		'beams-trussed',
		'trusses-straight',
		'trusses-triangular',
		'frames-portal',
		'frames-three-hinged',
		'frames-three-hinged-bent',
		'arches'
	],
	concrete: ['beams', 'floors-ribbed', 'floors-wide-slab', 'floors-composite-deck']
};

/** Symbols of the span in the rules; conditions on them are checked against l. */
const SPAN = new Set(['l', 'L']);

/** The leading rule of a variant: the depth when there is one. */
const LEAD = ['h', 'h1', 'h_knik'];

/**
 * One column of a source table: the rules that belong together, e.g. a = 0,25 · l and
 * h = l/16 – l/21 for one cantilever variant. The lead rule comes first.
 */
export interface BeamVariant {
	key: string;
	group: string;
	facts: Fact[];
}

/**
 * Rules of one variant share an id up to the symbol: hout-ligger-overstek-a025-a and
 * hout-ligger-overstek-a025-h are one variant; a rule without that suffix stands alone.
 */
export function variantKey(fact: Fact): string {
	const suffix = fact.symbol && `-${fact.symbol.replace(/_/g, '-')}`;
	return suffix && fact.id.endsWith(suffix) ? fact.id.slice(0, -suffix.length) : fact.id;
}

export function beamVariants(facts: readonly Fact[], groups: readonly string[]): BeamVariant[] {
	const byKey = new Map<string, BeamVariant>();
	for (const g of groups) {
		// Product data in the same groups (slab thickness, panel length) is no rule for a span.
		for (const f of facts.filter((x) => x.group === g && x.type === 'rule_of_thumb')) {
			const key = variantKey(f);
			const v = byKey.get(key) ?? { key, group: g, facts: [] };
			v.facts.push(f);
			byKey.set(key, v);
		}
	}
	const rank = (f: Fact) => {
		const i = LEAD.indexOf(f.symbol ?? '');
		return i === -1 ? LEAD.length : i;
	};
	return [...byKey.values()].map((v) => ({
		...v,
		facts: [...v.facts].sort((a, b) => rank(a) - rank(b))
	}));
}

export interface BeamResult {
	fact: Fact;
	/**
	 * - span: computed from l
	 * - derived: computed from another result, e.g. h_voet = 0,4 · h_knik
	 * - fixed: a value of its own, e.g. r ≥ 6 m
	 * - unknown: needs a quantity the estimator was not given, e.g. g in (l+g)
	 */
	kind: 'span' | 'derived' | 'fixed' | 'unknown';
	/** [low, high] in m for span and derived; equal ends for a single value. */
	range?: [number, number];
}

export interface BeamEstimate {
	results: BeamResult[];
	/** Span conditions of the lead rule that l does not meet; empty when l is in range. */
	outside: Condition[];
}

const pair = (v: Fact['value']): [number, number] => (Array.isArray(v) ? v : [v, v]);

/** Whether a value meets a condition; ends count as inside. */
export function meets(c: Condition, x: number): boolean {
	const [lo, hi] = pair(c.value);
	if (c.bound === 'range') return x >= lo - 1e-9 && x <= hi + 1e-9;
	if (c.bound === 'max') return x <= hi + 1e-9;
	if (c.bound === 'min') return x >= lo - 1e-9;
	return Math.abs(x - lo) < 1e-9;
}

/**
 * The length a rule divides or multiplies: the span l (L in the concrete tables), or l + g in the
 * frames with a kinked leg, where g is the height of the leg (base to knee, per the source figure).
 */
const LENGTHS: Record<string, (l: number, g?: number) => number | undefined> = {
	l: (l) => l,
	L: (l) => l,
	'(l+g)': (l, g) => (g === undefined ? undefined : l + g)
};

/** Whether the variant has a rule in (l+g), so the estimator should ask for g. */
export const needsLegHeight = (variant: BeamVariant) =>
	variant.facts.some((f) => f.divisorOf === '(l+g)' || f.factorOf === '(l+g)');

export function estimateBeam(
	variant: BeamVariant,
	l: number,
	{ g }: { g?: number } = {}
): BeamEstimate {
	if (!(l > 0)) throw new RangeError('span l must be positive');
	if (g !== undefined && !(g > 0)) throw new RangeError('leg height g must be positive');
	const known = new Map<string, [number, number]>();
	const results = new Map<string, BeamResult>();
	const length = (symbol?: string) => (symbol ? LENGTHS[symbol]?.(l, g) : undefined);

	for (const f of variant.facts) {
		const [a, b] = pair(f.value);
		const over = length(f.divisorOf);
		const times = length(f.factorOf);
		if (over !== undefined) {
			// h = l/15 – l/20: the larger n gives the smaller size.
			results.set(f.id, {
				fact: f,
				kind: 'span',
				range: [over / Math.max(a, b), over / Math.min(a, b)]
			});
		} else if (times !== undefined) {
			results.set(f.id, { fact: f, kind: 'span', range: [a * times, b * times] });
		} else if (!f.divisorOf && !f.factorOf) {
			results.set(f.id, { fact: f, kind: 'fixed' });
		}
		const r = results.get(f.id);
		if (r?.range && f.symbol) known.set(f.symbol, r.range);
	}
	// Factors of another result (h_voet = 0,4 · h_knik), once that result is known.
	for (const f of variant.facts) {
		if (results.has(f.id)) continue;
		const base = f.factorOf && known.get(f.factorOf);
		if (base) {
			const [a, b] = pair(f.value);
			results.set(f.id, { fact: f, kind: 'derived', range: [a * base[0], b * base[1]] });
		} else {
			results.set(f.id, { fact: f, kind: 'unknown' });
		}
	}

	const lead = variant.facts[0]!;
	const outside = (lead.when ?? []).filter((c) => SPAN.has(c.symbol) && !meets(c, l));
	return { results: variant.facts.map((f) => results.get(f.id)!), outside };
}
