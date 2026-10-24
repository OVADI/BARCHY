import { describe, expect, it } from 'vitest';
import raw from '../../../content/facts/bbl.json';
import { FactFile } from '../schema/fact';
import { checkStair, minRisers, stairLimits } from './stair';

// Limits are read from the content, so the tests follow a corrected fact instead of hiding it.
const { facts } = FactFile.parse(raw);
const limits = stairLimits(facts);
const R = limits.riserMax.mm;
const A = limits.goingMin.mm;
const W = limits.widthMin.mm;
const H = limits.riseMax.mm;

describe('stairLimits', () => {
	it('reads the four Bbl limits in mm', () => {
		for (const l of Object.values(limits)) expect(l.mm).toBeGreaterThan(0);
		expect(limits.riserMax.fact.bound).toBe('max');
		expect(limits.goingMin.fact.bound).toBe('min');
	});

	it('fails loudly when a fact is missing', () => {
		expect(() => stairLimits(facts.filter((f) => f.id !== 'bbl-trap-optrede'))).toThrow(
			/bbl-trap-optrede/
		);
	});
});

describe('minRisers', () => {
	it('is exact at the limit and rounds up above it', () => {
		expect(minRisers(R * 15, R)).toBe(15);
		expect(minRisers(R * 15 + 1, R)).toBe(16);
	});
});

describe('checkStair', () => {
	it('passes a stair exactly at every limit', () => {
		const n = 12;
		const r = checkStair({ rise: R * n, risers: n, going: A, width: W }, limits);
		expect(r.riser).toBeCloseTo(R);
		expect(r.run).toBeCloseTo((n - 1) * A);
		expect(r.ok).toBe(true);
	});

	it('fails each limit on its own', () => {
		const base = { rise: R * 10, risers: 10, going: A, width: W };
		const failed = (input: typeof base) =>
			checkStair(input, limits)
				.checks.filter((c) => !c.ok)
				.map((c) => c.id);
		expect(failed({ ...base, risers: 9 })).toEqual(['riserMax']);
		expect(failed({ ...base, going: A - 1 })).toEqual(['goingMin']);
		expect(failed({ ...base, width: W - 1 })).toEqual(['widthMin']);
		const tall = Math.ceil((H + 1) / R);
		expect(failed({ ...base, rise: H + 1, risers: tall })).toEqual(['riseMax']);
	});

	it('rejects impossible input', () => {
		expect(() => checkStair({ rise: 2800, risers: 0, going: A, width: W }, limits)).toThrow();
		expect(() => checkStair({ rise: -1, risers: 10, going: A, width: W }, limits)).toThrow();
	});
});
