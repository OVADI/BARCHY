import { describe, expect, it } from 'vitest';
import { bomTotals, memberMass } from './weight';

describe('memberMass', () => {
	it('is G × length × count', () => {
		expect(memberMass(42.3, 6000)).toBeCloseTo(253.8, 9);
		expect(memberMass(42.3, 6000, 3)).toBeCloseTo(761.4, 9);
	});

	it('is zero for zero length or count', () => {
		expect(memberMass(42.3, 0)).toBe(0);
		expect(memberMass(42.3, 6000, 0)).toBe(0);
	});

	it('rejects negative or missing input', () => {
		expect(() => memberMass(-1, 1000)).toThrow(RangeError);
		expect(() => memberMass(10, -1)).toThrow(RangeError);
		expect(() => memberMass(Number.NaN, 1000)).toThrow(RangeError);
	});
});

describe('bomTotals', () => {
	it('sums mass, positions and pieces', () => {
		const t = bomTotals([
			{ G: 42.3, length: 6000, count: 2 },
			{ G: 10, length: 500, count: 4 }
		]);
		expect(t.mass).toBeCloseTo(507.6 + 20, 9);
		expect(t.positions).toBe(2);
		expect(t.pieces).toBe(6);
	});

	it('is zero for an empty list', () => {
		expect(bomTotals([])).toEqual({ mass: 0, positions: 0, pieces: 0 });
	});
});
