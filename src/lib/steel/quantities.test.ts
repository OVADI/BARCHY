import { describe, expect, it } from 'vitest';
import { quantity, scaled, unitLabel } from './quantities';

describe('quantities', () => {
	it('scales to the Vademecum display units without float noise', () => {
		expect(scaled(9_247_000, quantity('Iy'))).toBe(924.7);
		expect(scaled(2400, quantity('A'))).toBe(24);
		expect(scaled(116_000, quantity('Wy'))).toBe(116);
		expect(scaled(7.5, quantity('tw'))).toBe(7.5);
	});

	it('labels the scale with superscripts', () => {
		expect(unitLabel(quantity('Iy'))).toBe('×10⁴ mm⁴');
		expect(unitLabel(quantity('A'))).toBe('×10² mm²');
		expect(unitLabel(quantity('G'))).toBe('kg/m');
	});
});
