import type { Fact } from '../schema/fact';

/**
 * Stair check against the Bbl (woonfunctie, nieuwbouw). Pure functions; inputs in mm.
 * The limits come from content/facts/bbl.json, so a corrected fact changes the check.
 */

/** Facts the check reads, by role. */
export const STAIR_FACTS = {
	riserMax: 'bbl-trap-optrede',
	goingMin: 'bbl-trap-aantrede',
	widthMin: 'bbl-trap-breedte',
	riseMax: 'bbl-trap-hoogteverschil'
} as const;

export type StairCheckId = keyof typeof STAIR_FACTS;

/** Limits in mm, with the facts they came from. */
export type StairLimits = Record<StairCheckId, { mm: number; fact: Fact }>;

export function stairLimits(facts: readonly Fact[]): StairLimits {
	const pick = (id: string, bound: 'min' | 'max') => {
		const fact = facts.find((f) => f.id === id);
		if (!fact || Array.isArray(fact.value) || fact.unit !== 'm' || fact.bound !== bound) {
			throw new Error(`stair check needs fact ${id} as a single ${bound} value in m`);
		}
		return { mm: fact.value * 1000, fact };
	};
	return {
		riserMax: pick(STAIR_FACTS.riserMax, 'max'),
		goingMin: pick(STAIR_FACTS.goingMin, 'min'),
		widthMin: pick(STAIR_FACTS.widthMin, 'min'),
		riseMax: pick(STAIR_FACTS.riseMax, 'max')
	};
}

export interface StairInput {
	/** Height difference the stair bridges (floor to floor). */
	rise: number;
	risers: number;
	going: number;
	width: number;
}

export interface StairCheck {
	id: StairCheckId;
	ok: boolean;
	/** Value of the design, mm. */
	found: number;
	limit: number;
	fact: Fact;
}

export interface StairResult {
	/** Height of one riser, mm. */
	riser: number;
	/** Horizontal length of a straight stair whose top step is the floor: (n − 1) × going, mm. */
	run: number;
	checks: StairCheck[];
	ok: boolean;
}

/** Fewest risers that keep each riser within the limit. */
export function minRisers(rise: number, riserMax: number): number {
	if (!(rise > 0) || !(riserMax > 0)) throw new RangeError('rise and riserMax must be positive');
	// Round first so 2820 / 188 = 15 exactly is not pushed to 16 by floating point noise.
	return Math.ceil(Math.round((rise / riserMax) * 1e9) / 1e9);
}

export function checkStair(input: StairInput, limits: StairLimits): StairResult {
	const { rise, risers, going, width } = input;
	if (!(rise > 0) || !(going > 0) || !(width > 0) || !Number.isInteger(risers) || risers < 1) {
		throw new RangeError('rise, going and width must be positive; risers a positive integer');
	}
	const riser = rise / risers;
	const max = (id: StairCheckId, found: number): StairCheck => ({
		id,
		found,
		limit: limits[id].mm,
		fact: limits[id].fact,
		ok: found <= limits[id].mm + 1e-9
	});
	const min = (id: StairCheckId, found: number): StairCheck => ({
		id,
		found,
		limit: limits[id].mm,
		fact: limits[id].fact,
		ok: found >= limits[id].mm - 1e-9
	});
	const checks = [
		max('riserMax', riser),
		min('goingMin', going),
		min('widthMin', width),
		max('riseMax', rise)
	];
	return { riser, run: (risers - 1) * going, checks, ok: checks.every((c) => c.ok) };
}
